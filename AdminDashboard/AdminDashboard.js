document.addEventListener("DOMContentLoaded", async () => {
  let users = [];
  let filteredUsers = [];
  let currentPage = 1;
  const usersPerPage = 10;
  let autoRefreshInterval;
  let isAutoRefreshEnabled = true;
  let currentConfirmCallback = null;

  const usersTableBody = document.getElementById("users-table-body");
  const nameFilter = document.getElementById("name-filter");
  const studentIdFilter = document.getElementById("student-id-filter");
  const clearFiltersBtn = document.getElementById("clear-filters");
  const refreshBtn = document.getElementById("refresh-btn");
  const toggleRefreshBtn = document.getElementById("toggle-refresh");
  const autoRefreshStatus = document.getElementById("auto-refresh-status");
  const waitingCountElement = document.getElementById("waiting-count");
  const matchedCountElement = document.getElementById("matched-count");
  const matchAllBtn = document.getElementById("match-all-btn");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const pageInfoElement = document.getElementById("page-info");
  const adminNameElement = document.getElementById("admin-name");
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const loadingOverlay = document.getElementById("loading-overlay");
  const confirmModal = document.getElementById("confirm-modal");
  const confirmMessage = document.getElementById("confirm-message");
  const confirmOkBtn = document.getElementById("confirm-ok");
  const confirmCancelBtn = document.getElementById("confirm-cancel");
  const closeModalBtn = document.querySelector(".close-modal");
  const sectionTitle = document.getElementById("section-title");

  const adminName = localStorage.getItem("adminName") || "관리자";
  adminNameElement.textContent = adminName;

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  document.querySelectorAll(".sidebar-nav li").forEach((item) => {
    item.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section");
      showSection(sectionId);
      document
        .querySelectorAll(".sidebar-nav li")
        .forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");
    });
  });

  async function checkAdminRole() {
    const token = localStorage.getItem("token");
    if (!token) return redirectToLogin();
    const res = await fetch("https://meltin.shop/api/admin/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return redirectToLogin();
    const data = await res.json();
    if (data.role !== "ROLE_ADMIN") return redirectToLogin();
  }

  function redirectToLogin() {
    alert("관리자만 접근 가능합니다.");
    localStorage.clear();
    window.location.href = "../LogInPage/LogInPage.html";
  }

  function showSection(sectionId) {
    document
      .querySelectorAll(".content-section")
      .forEach((section) => section.classList.remove("active"));
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
      targetSection.classList.add("active");
      sectionTitle.textContent =
        sectionId === "users" ? "사용자 관리" : "설문 관리";
      if (
        sectionId === "surveys" &&
        typeof window.loadSurveyResponses === "function"
      ) {
        window.loadSurveyResponses();
      }
    }
  }

  nameFilter.addEventListener("input", applyFilters);
  studentIdFilter.addEventListener("input", applyFilters);

  clearFiltersBtn.addEventListener("click", () => {
    nameFilter.value = "";
    studentIdFilter.value = "";
    applyFilters();
  });

  refreshBtn.addEventListener("click", fetchUsers);

  toggleRefreshBtn.addEventListener("click", () => {
    isAutoRefreshEnabled = !isAutoRefreshEnabled;
    toggleRefreshBtn.innerHTML = `<i class="fas fa-toggle-${
      isAutoRefreshEnabled ? "on" : "off"
    }"></i>`;
    autoRefreshStatus.textContent = `자동 새로고침: ${
      isAutoRefreshEnabled ? "켜짐" : "꺼짐"
    }`;
    isAutoRefreshEnabled ? startAutoRefresh() : stopAutoRefresh();
  });

  matchAllBtn.addEventListener("click", () => {
    const waitingCount = users.filter(
      (user) => user.status === "waiting"
    ).length;
    if (waitingCount === 0) return alert("매칭할 대기 중인 사용자가 없습니다.");
    showConfirmModal(
      `대기 중인 ${waitingCount}명의 사용자를 모두 매칭하시겠습니까?`,
      matchAllUsers
    );
  });

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderUsers();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderUsers();
    }
  });

  confirmOkBtn.addEventListener("click", () => {
    if (currentConfirmCallback) currentConfirmCallback();
    hideConfirmModal();
  });
  confirmCancelBtn.addEventListener("click", hideConfirmModal);
  closeModalBtn.addEventListener("click", hideConfirmModal);

  function showConfirmModal(message, callback) {
    confirmMessage.textContent = message;
    currentConfirmCallback = callback;
    confirmModal.classList.remove("hidden");
  }
  function hideConfirmModal() {
    confirmModal.classList.add("hidden");
  }

  function startAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    autoRefreshInterval = setInterval(fetchUsers, 5000);
  }
  function stopAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
  }

  function applyFilters() {
    const nameValue = nameFilter.value.toLowerCase();
    const studentIdValue = studentIdFilter.value.toLowerCase();
    filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(nameValue) &&
        user.studentId.toLowerCase().includes(studentIdValue)
    );
    currentPage = 1;
    renderUsers();
    updateStats();
  }

  async function fetchUsers() {
    try {
      showLoading();
      const token = localStorage.getItem("token");
      if (!token) throw new Error("인증 토큰이 없습니다.");

      const response = await fetch("https://meltin.shop/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        handleAuthFailure(response.status);
        throw new Error("사용자 데이터를 가져오는 데 실패했습니다.");
      }

      const result = await response.json();
      users = result.users.map((u, idx) => ({
        id: idx,
        name: u.name,
        username: u.username || "-",
        studentId: u.studentId,
        mbti: u.mbti || "-",
        interest: u.interest || "-",
        communicationStyle: u.communicationStyle || "-",
        preferredRole: u.preferredRole || "-",
        selfKeywords: u.selfKeywords || "-",
        matchingPreference: u.matchingPreference || "-",
        status:
          u.teamNumber === null || u.teamNumber === undefined
            ? "waiting"
            : "matched", // ← 여기만 수정
      }));
      filteredUsers = [...users];
      renderUsers();
      updateStats();
      hideLoading();
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(error.message);
      hideLoading();
    }
  }

  async function matchAllUsers() {
    try {
      showLoading();
      const token = localStorage.getItem("token");
      if (!token) throw new Error("인증 토큰이 없습니다.");

      const response = await fetch("https://meltin.shop/api/admin/match", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        handleAuthFailure(response.status);
        throw new Error("사용자 매칭 실패");
      }

      alert("모든 대기 사용자가 매칭되었습니다.");
      await fetchUsers();
      hideLoading();
    } catch (error) {
      console.error("Error matching users:", error);
      alert(error.message);
      hideLoading();
    }
  }

  function renderUsers() {
    if (filteredUsers.length === 0) {
      usersTableBody.innerHTML = `<tr><td colspan="11" class="loading-message">표시할 사용자가 없습니다.</td></tr>`;
      updatePagination();
      return;
    }
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = Math.min(startIndex + usersPerPage, filteredUsers.length);
    const usersToDisplay = filteredUsers.slice(startIndex, endIndex);
    usersTableBody.innerHTML = "";
    usersToDisplay.forEach((user) => {
      const statusClass =
        user.status === "matched" ? "status-matched" : "status-waiting";
      const statusText = user.status === "matched" ? "매칭됨" : "대기 중";
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.username}</td>
        <td>${user.studentId}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td class="action-buttons">
          <button class="approve-btn" data-user-id="${user.id}" ${
        user.status === "matched" ? "disabled" : ""
      }>
            <i class="fas fa-check"></i> 매칭
          </button>
        </td>
      `;
      usersTableBody.appendChild(row);
    });
    updatePagination();
  }

  function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    pageInfoElement.textContent = `페이지 ${currentPage} / ${totalPages || 1}`;
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages || totalPages === 0;
  }

  function updateStats() {
    const waitingCount = users.filter(
      (user) => user.status === "waiting"
    ).length;
    const matchedCount = users.filter(
      (user) => user.status === "matched"
    ).length;
    waitingCountElement.textContent = `${waitingCount}명`;
    matchedCountElement.textContent = `${matchedCount}명`;
  }

  function showLoading() {
    loadingOverlay.classList.remove("hidden");
  }
  function hideLoading() {
    loadingOverlay.classList.add("hidden");
  }

  function handleAuthFailure(status) {
    if (status === 401 || status === 403) redirectToLogin();
  }

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../LogInPage/LogInPage.html";
  });

  await checkAdminRole();
  fetchUsers();
  if (isAutoRefreshEnabled) startAutoRefresh();

  window.showLoadingIndicator = showLoading;
  window.hideLoadingIndicator = hideLoading;
  window.showConfirmModal = showConfirmModal;
  window.showSection = showSection;
});
