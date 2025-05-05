document.addEventListener("DOMContentLoaded", () => {
  // 전역 변수
  let users = []
  let filteredUsers = []
  let currentPage = 1
  const usersPerPage = 10
  let autoRefreshInterval
  let isAutoRefreshEnabled = true
  let currentConfirmCallback = null

  // 백엔드 API 기본 URL
  const API_BASE_URL = "http://localhost:8080/api"

  // 테스트용 토큰 설정
  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", "test-token-12345")
    localStorage.setItem("adminName", "테스트 관리자")
    localStorage.setItem("adminToken", "admin-token-67890") // 관리자 토큰 추가
  }

  // DOM 요소
  const usersTableBody = document.getElementById("users-table-body")
  const nameFilter = document.getElementById("name-filter")
  const studentIdFilter = document.getElementById("student-id-filter")
  const clearFiltersBtn = document.getElementById("clear-filters")
  const refreshBtn = document.getElementById("refresh-btn")
  const toggleRefreshBtn = document.getElementById("toggle-refresh")
  const autoRefreshStatus = document.getElementById("auto-refresh-status")
  const waitingCountElement = document.getElementById("waiting-count")
  const matchedCountElement = document.getElementById("matched-count")
  const matchAllBtn = document.getElementById("match-all-btn")
  const prevPageBtn = document.getElementById("prev-page")
  const nextPageBtn = document.getElementById("next-page")
  const pageInfoElement = document.getElementById("page-info")
  const adminNameElement = document.getElementById("admin-name")
  const menuToggle = document.querySelector(".menu-toggle")
  const sidebar = document.querySelector(".sidebar")
  const loadingOverlay = document.getElementById("loading-overlay")
  const confirmModal = document.getElementById("confirm-modal")
  const confirmMessage = document.getElementById("confirm-message")
  const confirmOkBtn = document.getElementById("confirm-ok")
  const confirmCancelBtn = document.getElementById("confirm-cancel")
  const closeModalBtn = document.querySelector(".close-modal")
  const sectionTitle = document.getElementById("section-title")

  // 관리자 이름 설정
  const adminName = localStorage.getItem("adminName") || "관리자"
  adminNameElement.textContent = adminName

  // 사이드바 토글
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active")
  })

  // 섹션 전환 이벤트 리스너
  document.querySelectorAll(".sidebar-nav li").forEach((item) => {
    item.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section")
      showSection(sectionId)

      // 활성 메뉴 아이템 변경
      document.querySelectorAll(".sidebar-nav li").forEach((nav) => nav.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // 섹션 표시 함수
  function showSection(sectionId) {
    // 모든 섹션 숨기기
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active")
    })

    // 선택한 섹션 표시
    const targetSection = document.getElementById(`${sectionId}-section`)
    if (targetSection) {
      targetSection.classList.add("active")

      // 섹션 제목 업데이트
      switch (sectionId) {
        case "users":
          sectionTitle.textContent = "사용자 관리"
          break
        case "surveys":
          sectionTitle.textContent = "설문 관리"
          // 설문 데이터 로드 - 여기서 window.loadSurveyResponses 사용
          if (typeof window.loadSurveyResponses === "function") {
            console.log("showSection에서 loadSurveyResponses 호출")
            window.loadSurveyResponses()
          } else {
            console.error("loadSurveyResponses 함수를 찾을 수 없습니다.")
          }
          break
      }
    }
  }

  // 필터 이벤트 리스너
  nameFilter.addEventListener("input", applyFilters)
  studentIdFilter.addEventListener("input", applyFilters)

  // 필터 초기화 버튼
  clearFiltersBtn.addEventListener("click", () => {
    nameFilter.value = ""
    studentIdFilter.value = ""
    applyFilters()
  })

  // 새로고침 버튼
  refreshBtn.addEventListener("click", () => {
    fetchUsers()
  })

  // 자동 새로고침 토글
  toggleRefreshBtn.addEventListener("click", () => {
    isAutoRefreshEnabled = !isAutoRefreshEnabled

    if (isAutoRefreshEnabled) {
      toggleRefreshBtn.innerHTML = '<i class="fas fa-toggle-on"></i>'
      autoRefreshStatus.textContent = "자동 새로고침: 켜짐"
      startAutoRefresh()
    } else {
      toggleRefreshBtn.innerHTML = '<i class="fas fa-toggle-off"></i>'
      autoRefreshStatus.textContent = "자동 새로고침: 꺼짐"
      stopAutoRefresh()
    }
  })

  // 모든 대기 사용자 매칭 버튼
  matchAllBtn.addEventListener("click", () => {
    const waitingCount = users.filter((user) => user.status === "waiting").length

    if (waitingCount === 0) {
      alert("매칭할 대기 중인 사용자가 없습니다.")
      return
    }

    showConfirmModal(`대기 중인 ${waitingCount}명의 사용자를 모두 매칭하시겠습니까?`, () => {
      matchAllUsers()
    })
  })

  // 페이지네이션 이벤트 리스너
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      renderUsers()
    }
  })

  nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
    if (currentPage < totalPages) {
      currentPage++
      renderUsers()
    }
  })

  // 모달 관련 이벤트 리스너
  confirmOkBtn.addEventListener("click", () => {
    if (currentConfirmCallback) {
      currentConfirmCallback()
      currentConfirmCallback = null
    }
    hideConfirmModal()
  })

  confirmCancelBtn.addEventListener("click", hideConfirmModal)
  closeModalBtn.addEventListener("click", hideConfirmModal)

  // 확인 모달 표시
  function showConfirmModal(message, callback) {
    confirmMessage.textContent = message
    currentConfirmCallback = callback
    confirmModal.classList.remove("hidden")
  }

  // 확인 모달 숨기기
  function hideConfirmModal() {
    confirmModal.classList.add("hidden")
  }

  // 자동 새로고침 시작
  function startAutoRefresh() {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval)
    }

    autoRefreshInterval = setInterval(fetchUsers, 5000)
  }

  // 자동 새로고침 중지
  function stopAutoRefresh() {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval)
      autoRefreshInterval = null
    }
  }

  // 필터 적용
  function applyFilters() {
    const nameValue = nameFilter.value.toLowerCase()
    const studentIdValue = studentIdFilter.value.toLowerCase()

    filteredUsers = users.filter((user) => {
      const nameMatch = user.name.toLowerCase().includes(nameValue)
      const studentIdMatch = user.studentId.toLowerCase().includes(studentIdValue)

      return nameMatch && studentIdMatch
    })

    currentPage = 1
    renderUsers()
    updateStats()
  }

  // 사용자 데이터 가져오기
  async function fetchUsers() {
    try {
      showLoading()

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.")
      }

      // 실제 API 호출
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert("인증이 만료되었습니다. 다시 로그인해주세요.")
          // 로그인 페이지로 리다이렉트
          window.location.href = "login.html"
          return
        }
        throw new Error("사용자 데이터를 가져오는데 실패했습니다.")
      }

      const data = await response.json()
      users = data
      filteredUsers = [...users]
      renderUsers()
      updateStats()

      hideLoading()
    } catch (error) {
      console.error("Error fetching users:", error)
      alert(error.message)
      hideLoading()
    }
  }

  // 사용자 상태 업데이트
  async function updateUserStatus(userId, status) {
    try {
      showLoading()

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.")
      }

      // 실제 API 호출
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert("인증이 만료되었습니다. 다시 로그인해주세요.")
          window.location.href = "login.html"
          return
        }
        throw new Error("사용자 상태 업데이트에 실패했습니다.")
      }

      // 성공 메시지
      alert(`사용자 상태가 '${status === "matched" ? "매칭됨" : "대기 중"}'으로 업데이트되었습니다.`)

      // 사용자 목록 새로고침
      await fetchUsers()

      hideLoading()
    } catch (error) {
      console.error("Error updating user status:", error)
      alert(error.message)
      hideLoading()
    }
  }

  // 모든 대기 사용자 매칭
  async function matchAllUsers() {
    try {
      showLoading()

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.")
      }

      // 실제 API 호출
      const response = await fetch(`${API_BASE_URL}/admin/match`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert("인증이 만료되었습니다. 다시 로그인해주세요.")
          window.location.href = "login.html"
          return
        }
        throw new Error("사용자 일괄 매칭에 실패했습니다.")
      }

      // 성공 메시지
      alert("모든 대기 중인 사용자가 성공적으로 매칭되었습니다.")

      // 사용자 목록 새로고침
      await fetchUsers()

      hideLoading()
    } catch (error) {
      console.error("Error matching all users:", error)
      alert(error.message)
      hideLoading()
    }
  }

  // 사용자 목록 렌더링
  function renderUsers() {
    if (filteredUsers.length === 0) {
      usersTableBody.innerHTML = `
                <tr>
                    <td colspan="11" class="loading-message">표시할 사용자가 없습니다.</td>
                </tr>
            `
      updatePagination()
      return
    }

    const startIndex = (currentPage - 1) * usersPerPage
    const endIndex = Math.min(startIndex + usersPerPage, filteredUsers.length)
    const usersToDisplay = filteredUsers.slice(startIndex, endIndex)

    usersTableBody.innerHTML = ""

    usersToDisplay.forEach((user) => {
      const row = document.createElement("tr")

      // 상태에 따른 배지 클래스 결정
      let statusClass = ""
      switch (user.status) {
        case "waiting":
          statusClass = "status-waiting"
          break
        case "matched":
          statusClass = "status-matched"
          break
        default:
          statusClass = "status-waiting"
      }

      // 상태에 따른 한글 텍스트
      let statusText = ""
      switch (user.status) {
        case "waiting":
          statusText = "대기 중"
          break
        case "matched":
          statusText = "매칭됨"
          break
        default:
          statusText = "대기 중"
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
                    <button class="approve-btn" data-user-id="${user.id}" ${user.status === "matched" ? "disabled" : ""}>
                        <i class="fas fa-check"></i> 매칭
                    </button>
                </td>
            `

      usersTableBody.appendChild(row)
    })

    // 승인 버튼 이벤트 리스너 추가
    document.querySelectorAll(".approve-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const userId = this.getAttribute("data-user-id")
        updateUserStatus(userId, "matched")
      })
    })

    updatePagination()
  }

  // 페이지네이션 업데이트
  function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

    pageInfoElement.textContent = `페이지 ${currentPage} / ${totalPages || 1}`

    prevPageBtn.disabled = currentPage <= 1
    nextPageBtn.disabled = currentPage >= totalPages || totalPages === 0
  }

  // 통계 업데이트
  function updateStats() {
    const waitingCount = users.filter((user) => user.status === "waiting").length
    const matchedCount = users.filter((user) => user.status === "matched").length

    waitingCountElement.textContent = `${waitingCount}명`
    matchedCountElement.textContent = `${matchedCount}명`
  }

  // 로딩 표시
  function showLoading() {
    loadingOverlay.classList.remove("hidden")
  }

  // 로딩 숨기기
  function hideLoading() {
    loadingOverlay.classList.add("hidden")
  }

  // 로그아웃 버튼 이벤트 리스너
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token")
    localStorage.removeItem("adminName")
    window.location.href = "login.html"
  })

  // 초기 데이터 로드
  fetchUsers()

  // 자동 새로고침 시작
  if (isAutoRefreshEnabled) {
    startAutoRefresh()
  }

  // 전역 함수로 노출
  window.showLoadingIndicator = showLoading
  window.hideLoadingIndicator = hideLoading
  window.showConfirmModal = showConfirmModal
  window.showSection = showSection
})

// 설문 종료 함수
async function endSurvey(surveyId) {
  try {
    showLoadingIndicator()

    const token = localStorage.getItem("token")
    const adminToken = localStorage.getItem("adminToken")

    if (!token || !adminToken) {
      throw new Error("인증 정보가 없습니다.")
    }

    const response = await fetch(`${API_BASE_URL}/admin/surveys/${surveyId}/end`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Admin-Token": adminToken,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("설문 종료 실패")
    }

    // 성공 메시지
    alert("설문이 성공적으로 종료되었습니다.")

    // 설문 목록 새로고침
    if (typeof loadSurveys === "function") {
      loadSurveys()
    }

    hideLoadingIndicator()
  } catch (error) {
    console.error("설문 종료 오류:", error)
    hideLoadingIndicator()
    alert(`설문 종료 중 오류가 발생했습니다: ${error.message}`)
  }
}

// 게임 시작 함수
async function startGame(surveyId) {
  try {
    showLoadingIndicator()

    const token = localStorage.getItem("token")
    const adminToken = localStorage.getItem("adminToken")

    if (!token || !adminToken) {
      throw new Error("인증 정보가 없습니다.")
    }

    const response = await fetch(`${API_BASE_URL}/admin/surveys/${surveyId}/start-game`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Admin-Token": adminToken,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("게임 시작 실패")
    }

    // 성공 메시지
    alert("게임이 성공적으로 시작되었습니다.")

    // 설문 목록 새로고침
    if (typeof loadSurveys === "function") {
      loadSurveys()
    }

    hideLoadingIndicator()
  } catch (error) {
    console.error("게임 시작 오류:", error)
    hideLoadingIndicator()
    alert(`게임 시작 중 오류가 발생했습니다: ${error.message}`)
  }
}

// 전역 스코프에서 함수 정의
function showLoadingIndicator() {
  const loadingOverlay = document.getElementById("loading-overlay")
  if (loadingOverlay) {
    loadingOverlay.classList.remove("hidden")
  }
}

function hideLoadingIndicator() {
  const loadingOverlay = document.getElementById("loading-overlay")
  if (loadingOverlay) {
    loadingOverlay.classList.add("hidden")
  }
}

// 설문 목록을 로드하는 함수
const loadSurveys = async () => {
  try {
    showLoadingIndicator()

    const token = localStorage.getItem("token")
    const adminToken = localStorage.getItem("adminToken")

    if (!token || !adminToken) {
      throw new Error("인증 정보가 없습니다.")
    }

    const response = await fetch(`${API_BASE_URL}/admin/surveys`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Admin-Token": adminToken,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("설문 목록 로드 실패")
    }

    const surveys = await response.json()

    // 설문 테이블 업데이트
    if (typeof updateSurveyTable === "function") {
      updateSurveyTable(surveys)
    }

    // 설문 통계 업데이트
    if (typeof updateSurveyStats === "function") {
      updateSurveyStats(surveys)
    }

    hideLoadingIndicator()
    return surveys
  } catch (error) {
    console.error("설문 목록 로드 오류:", error)
    hideLoadingIndicator()
    alert(`설문 목록을 불러오는 중 오류가 발생했습니다: ${error.message}`)
    return []
  }
}

// 설문 테이블 업데이트 함수 (예시)
function updateSurveyTable(surveys) {
  const surveyTableBody = document.getElementById("survey-table-body")
  if (!surveyTableBody) {
    console.error("survey-table-body를 찾을 수 없습니다.")
    return
  }

  // 기존 테이블 내용 비우기
  surveyTableBody.innerHTML = ""

  surveys.forEach((survey) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${survey.id}</td>
            <td>${survey.title}</td>
            <td>${survey.status}</td>
            <td>
                <button onclick="endSurvey(${survey.id})">설문 종료</button>
                <button onclick="startGame(${survey.id})">게임 시작</button>
            </td>
        `
    surveyTableBody.appendChild(row)
  })
}

// 설문 통계 업데이트 함수 (예시)
function updateSurveyStats(surveys) {
  const totalSurveysElement = document.getElementById("total-surveys")
  const activeSurveysElement = document.getElementById("active-surveys")
  const completedSurveysElement = document.getElementById("completed-surveys")

  if (!totalSurveysElement || !activeSurveysElement || !completedSurveysElement) {
    console.error("통계 요소를 찾을 수 없습니다.")
    return
  }

  const activeSurveys = surveys.filter((survey) => survey.status === "active").length
  const completedSurveys = surveys.filter((survey) => survey.status === "completed").length

  totalSurveysElement.textContent = surveys.length
  activeSurveysElement.textContent = activeSurveys
  completedSurveysElement.textContent = completedSurveys
}
