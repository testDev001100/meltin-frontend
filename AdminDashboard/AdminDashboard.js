document.addEventListener("DOMContentLoaded", () => {
  // 전역 변수
  let users = [];
  let filteredUsers = [];
  let currentPage = 1;
  const usersPerPage = 10;
  let autoRefreshInterval;
  let isAutoRefreshEnabled = true;
  let currentConfirmCallback = null;

  // 테스트용 토큰 설정
  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", "test-token-12345");
    localStorage.setItem("adminName", "테스트 관리자");
    localStorage.setItem("adminToken", "admin-token-67890"); // 관리자 토큰 추가
  }

  // DOM 요소
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

  // 관리자 이름 설정
  const adminName = localStorage.getItem("adminName") || "관리자";
  adminNameElement.textContent = adminName;

  // 사이드바 토글
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // 섹션 전환 이벤트 리스너
  document.querySelectorAll(".sidebar-nav li").forEach((item) => {
    item.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section");
      showSection(sectionId);

      // 활성 메뉴 아이템 변경
      document
        .querySelectorAll(".sidebar-nav li")
        .forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // 섹션 표시 함수
  function showSection(sectionId) {
    // 모든 섹션 숨기기
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active");
    });

    // 선택한 섹션 표시
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
      targetSection.classList.add("active");

      // 섹션 제목 업데이트
      switch (sectionId) {
        case "users":
          sectionTitle.textContent = "사용자 관리";
          break;
        case "surveys":
          sectionTitle.textContent = "설문 관리";
          // 설문 데이터 로드 - 여기서 window.loadSurveyResponses 사용
          if (typeof window.loadSurveyResponses === "function") {
            console.log("showSection에서 loadSurveyResponses 호출");
            window.loadSurveyResponses();
          } else {
            console.error("loadSurveyResponses 함수를 찾을 수 없습니다.");
          }
          break;
      }
    }
  }

  // 필터 이벤트 리스너
  nameFilter.addEventListener("input", applyFilters);
  studentIdFilter.addEventListener("input", applyFilters);

  // 필터 초기화 버튼
  clearFiltersBtn.addEventListener("click", () => {
    nameFilter.value = "";
    studentIdFilter.value = "";
    applyFilters();
  });

  // 새로고침 버튼
  refreshBtn.addEventListener("click", () => {
    fetchUsers();
  });

  // 자동 새로고침 토글
  toggleRefreshBtn.addEventListener("click", () => {
    isAutoRefreshEnabled = !isAutoRefreshEnabled;

    if (isAutoRefreshEnabled) {
      toggleRefreshBtn.innerHTML = '<i class="fas fa-toggle-on"></i>';
      autoRefreshStatus.textContent = "자동 새로고침: 켜짐";
      startAutoRefresh();
    } else {
      toggleRefreshBtn.innerHTML = '<i class="fas fa-toggle-off"></i>';
      autoRefreshStatus.textContent = "자동 새로고침: 꺼짐";
      stopAutoRefresh();
    }
  });

  // 모든 대기 사용자 매칭 버튼
  matchAllBtn.addEventListener("click", () => {
    const waitingCount = users.filter(
      (user) => user.status === "waiting"
    ).length;

    if (waitingCount === 0) {
      alert("매칭할 대기 중인 사용자가 없습니다.");
      return;
    }

    showConfirmModal(
      `대기 중인 ${waitingCount}명의 사용자를 모두 매칭하시겠습니까?`,
      () => {
        matchAllUsers();
      }
    );
  });

  // 페이지네이션 이벤트 리스너
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

  // 모달 관련 이벤트 리스너
  confirmOkBtn.addEventListener("click", () => {
    if (currentConfirmCallback) {
      currentConfirmCallback();
      currentConfirmCallback = null;
    }
    hideConfirmModal();
  });

  confirmCancelBtn.addEventListener("click", hideConfirmModal);
  closeModalBtn.addEventListener("click", hideConfirmModal);

  // 확인 모달 표시
  function showConfirmModal(message, callback) {
    confirmMessage.textContent = message;
    currentConfirmCallback = callback;
    confirmModal.classList.remove("hidden");
  }

  // 확인 모달 숨기기
  function hideConfirmModal() {
    confirmModal.classList.add("hidden");
  }

  // 자동 새로고침 시작
  function startAutoRefresh() {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
    }

    autoRefreshInterval = setInterval(fetchUsers, 5000);
  }

  // 자동 새로고침 중지
  function stopAutoRefresh() {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      autoRefreshInterval = null;
    }
  }

  // 필터 적용
  function applyFilters() {
    const nameValue = nameFilter.value.toLowerCase();
    const studentIdValue = studentIdFilter.value.toLowerCase();

    filteredUsers = users.filter((user) => {
      const nameMatch = user.name.toLowerCase().includes(nameValue);
      const studentIdMatch = user.studentId
        .toLowerCase()
        .includes(studentIdValue);

      return nameMatch && studentIdMatch;
    });

    currentPage = 1;
    renderUsers();
    updateStats();
  }

  // 사용자 데이터 가져오기
  async function fetchUsers() {
    try {
      showLoading();

      // API 호출 대신 테스트 데이터 사용
      // 실제 구현 시 아래 주석 해제하고 loadTestData() 호출 제거
      /*
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
      }

      const response = await fetch("http://localhost:3000/api/admin/waiting-users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert("인증이 만료되었습니다. 다시 로그인해주세요.");
          // 로그인 페이지로 리다이렉트
          window.location.href = "login.html";
          return;
        }
        throw new Error("사용자 데이터를 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      users = data;
      */

      // 테스트 데이터 로드
      loadTestData();

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

  // 사용자 상태 업데이트
  async function updateUserStatus(userId, status) {
    try {
      showLoading();

      // API 호출 대신 로컬 데이터 업데이트
      const userIndex = users.findIndex(
        (user) => user.id === Number.parseInt(userId)
      );
      if (userIndex !== -1) {
        users[userIndex].status = status;

        // 필터링된 사용자 목록도 업데이트
        const filteredIndex = filteredUsers.findIndex(
          (user) => user.id === Number.parseInt(userId)
        );
        if (filteredIndex !== -1) {
          filteredUsers[filteredIndex].status = status;
        }

        renderUsers();
        updateStats();

        // 성공 메시지
        alert(
          `사용자 상태가 '${
            status === "matched" ? "매칭됨" : "대기 중"
          }'으로 업데이트되었습니다.`
        );
      } else {
        throw new Error("사용자를 찾을 수 없습니다.");
      }

      hideLoading();
    } catch (error) {
      console.error("Error updating user status:", error);
      alert(error.message);
      hideLoading();
    }
  }

  // 모든 대기 사용자 매칭
  async function matchAllUsers() {
    try {
      showLoading();

      // API 호출 대신 로컬 데이터 업데이트
      let matchedCount = 0;
      users.forEach((user) => {
        if (user.status === "waiting") {
          user.status = "matched";
          matchedCount++;
        }
      });

      // 필터링된 사용자 목록도 업데이트
      filteredUsers.forEach((user) => {
        if (user.status === "waiting") {
          user.status = "matched";
        }
      });

      renderUsers();
      updateStats();

      // 성공 메시지
      alert(
        `${matchedCount}명의 대기 중인 사용자가 성공적으로 매칭되었습니다.`
      );

      hideLoading();
    } catch (error) {
      console.error("Error matching all users:", error);
      alert(error.message);
      hideLoading();
    }
  }

  // 사용자 목록 렌더링
  function renderUsers() {
    if (filteredUsers.length === 0) {
      usersTableBody.innerHTML = `
                <tr>
                    <td colspan="11" class="loading-message">표시할 사용자가 없습니다.</td>
                </tr>
            `;
      updatePagination();
      return;
    }

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = Math.min(startIndex + usersPerPage, filteredUsers.length);
    const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

    usersTableBody.innerHTML = "";

    usersToDisplay.forEach((user) => {
      const row = document.createElement("tr");

      // 상태에 따른 배지 클래스 결정
      let statusClass = "";
      switch (user.status) {
        case "waiting":
          statusClass = "status-waiting";
          break;
        case "matched":
          statusClass = "status-matched";
          break;
        default:
          statusClass = "status-waiting";
      }

      // 상태에 따른 한글 텍스트
      let statusText = "";
      switch (user.status) {
        case "waiting":
          statusText = "대기 중";
          break;
        case "matched":
          statusText = "매칭됨";
          break;
        default:
          statusText = "대기 중";
      }

      row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${user.studentId}</td>
                <td>${user.mbti}</td>
                <td>${user.interest}</td>
                <td>${user.communicationStyle}</td>
                <td>${user.preferredRole}</td>
                <td>${user.selfKeywords}</td>
                <td>${user.matchingPreference}</td>
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

    // 승인 버튼 이벤트 리스너 추가
    document.querySelectorAll(".approve-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const userId = this.getAttribute("data-user-id");
        updateUserStatus(userId, "matched");
      });
    });

    updatePagination();
  }

  // 페이지네이션 업데이트
  function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    pageInfoElement.textContent = `페이지 ${currentPage} / ${totalPages || 1}`;

    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages || totalPages === 0;
  }

  // 통계 업데이트
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

  // 로딩 표시
  function showLoading() {
    loadingOverlay.classList.remove("hidden");
  }

  // 로딩 숨기기
  function hideLoading() {
    loadingOverlay.classList.add("hidden");
  }

  // 로그아웃 버튼 이벤트 리스너
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName");
    window.location.href = "login.html";
  });

  // 테스트 데이터 로드
  function loadTestData() {
    console.log("테스트 데이터 로드 중...");
    users = [
      {
        id: 1,
        username: "user1",
        name: "김철수",
        studentId: "20230001",
        mbti: "ENFJ",
        interest: "인공지능, 웹개발",
        communicationStyle: "적극적",
        preferredRole: "프론트엔드",
        selfKeywords: "창의적, 책임감",
        matchingPreference: "비슷한 관심사",
        status: "waiting",
      },
      {
        id: 2,
        username: "user2",
        name: "이영희",
        studentId: "20230002",
        mbti: "INTJ",
        interest: "데이터 분석, 머신러닝",
        communicationStyle: "논리적",
        preferredRole: "백엔드",
        selfKeywords: "분석적, 체계적",
        matchingPreference: "다양한 역할",
        status: "waiting",
      },
      {
        id: 3,
        username: "user3",
        name: "박지민",
        studentId: "20230003",
        mbti: "ESFP",
        interest: "UI/UX, 그래픽 디자인",
        communicationStyle: "친화적",
        preferredRole: "디자이너",
        selfKeywords: "창의적, 직관적",
        matchingPreference: "상호보완적",
        status: "matched",
      },
      {
        id: 4,
        username: "user4",
        name: "최민준",
        studentId: "20230004",
        mbti: "ENTJ",
        interest: "프로젝트 관리, 리더십",
        communicationStyle: "직접적",
        preferredRole: "PM",
        selfKeywords: "체계적, 리더십",
        matchingPreference: "다양한 역할",
        status: "matched",
      },
      {
        id: 5,
        username: "user5",
        name: "정수빈",
        studentId: "20230005",
        mbti: "ENFP",
        interest: "모바일 앱, 게임 개발",
        communicationStyle: "열정적",
        preferredRole: "풀스택",
        selfKeywords: "혁신적, 다재다능",
        matchingPreference: "비슷한 성격",
        status: "waiting",
      },
    ];

    filteredUsers = [...users];
    renderUsers();
    updateStats();
    console.log("테스트 데이터 로드 완료:", users.length, "명의 사용자");
  }

  // 초기 데이터 로드
  fetchUsers();

  // 자동 새로고침 시작 (테스트 중에는 비활성화)
  // if (isAutoRefreshEnabled) {
  //   startAutoRefresh();
  // }

  // 전역 함수로 노출
  window.showLoadingIndicator = showLoading;
  window.hideLoadingIndicator = hideLoading;
  window.showConfirmModal = showConfirmModal;
  window.showSection = showSection;
});

// 설문 목록을 로드하는 함수 (가정)
const loadSurveys = async () => {
  console.log("loadSurveys 함수가 호출되었습니다.");
  // 여기에 실제 설문 목록을 가져오는 로직을 구현해야 합니다.
  // 예: API 호출을 통해 설문 목록을 가져오고, 해당 목록을 화면에 표시하는 등의 작업.
};

// 설문 종료 함수
async function endSurvey(surveyId) {
  try {
    showLoadingIndicator();

    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (!token || !adminToken) {
      throw new Error("인증 정보가 없습니다.");
    }

    const response = await fetch(
      `http://192.168.123.100:8080/api/admin/surveys/${surveyId}/end`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Admin-Token": adminToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("설문 종료 실패");
    }

    // 성공 메시지
    alert("설문이 성공적으로 종료되었습니다.");

    // 설문 목록 새로고침
    if (typeof loadSurveys === "function") {
      loadSurveys();
    }

    hideLoadingIndicator();
  } catch (error) {
    console.error("설문 종료 오류:", error);
    hideLoadingIndicator();
    alert(`설문 종료 중 오류가 발생했습니다: ${error.message}`);
  }
}

// 게임 시작 함수
async function startGame(surveyId) {
  try {
    showLoadingIndicator();

    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (!token || !adminToken) {
      throw new Error("인증 정보가 없습니다.");
    }

    const response = await fetch(
      `http://192.168.123.100:8080/api/admin/surveys/${surveyId}/start-game`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Admin-Token": adminToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("게임 시작 실패");
    }

    // 성공 메시지
    alert("게임이 성공적으로 시작되었습니다.");

    // 설문 목록 새로고침
    if (typeof loadSurveys === "function") {
      loadSurveys();
    }

    hideLoadingIndicator();
  } catch (error) {
    console.error("게임 시작 오류:", error);
    hideLoadingIndicator();
    alert(`게임 시작 중 오류가 발생했습니다: ${error.message}`);
  }
}

// 전역 스코프에서 함수 정의
function showLoadingIndicator() {
  const loadingOverlay = document.getElementById("loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.classList.remove("hidden");
  }
}

function hideLoadingIndicator() {
  const loadingOverlay = document.getElementById("loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.classList.add("hidden");
  }
}
