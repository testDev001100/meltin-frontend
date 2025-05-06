// 전역 변수
let surveyResponses = [];
let filteredSurveyResponses = [];
let currentSurveyPage = 1;
const responsesPerPage = 10;

// 백엔드 API 기본 URL
const API_BASE_URL = "http://192.168.123.100:8080/api";

// 설문 응답 데이터 로드 함수
async function loadSurveyResponses() {
  try {
    console.log("설문 응답 데이터 로드 함수 호출됨");

    // 로딩 표시
    if (typeof window.showLoadingIndicator === "function") {
      window.showLoadingIndicator();
    } else {
      console.error("showLoadingIndicator 함수를 찾을 수 없습니다.");
    }

    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (!token || !adminToken) {
      throw new Error("인증 정보가 없습니다.");
    }

    // 실제 API 호출
    const response = await fetch(`${API_BASE_URL}/admin/surveys`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Admin-Token": adminToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        alert("인증이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "../LogInPage/LogInPage.html";
        return false;
      }
      throw new Error("설문 응답 데이터 로드 실패");
    }

    const data = await response.json();
    surveyResponses = data;

    // 설문 응답 데이터 저장
    filteredSurveyResponses = [...surveyResponses];
    console.log(
      "설문 응답 데이터 로드됨:",
      surveyResponses.length,
      "개의 응답"
    );

    // 설문 응답 테이블 업데이트
    renderSurveyResponses();
    console.log("설문 응답 렌더링 완료");

    // 전체 설문 수 업데이트
    updateTotalSurveysCount();

    // 로딩 숨기기
    if (typeof window.hideLoadingIndicator === "function") {
      window.hideLoadingIndicator();
    } else {
      console.error("hideLoadingIndicator 함수를 찾을 수 없습니다.");
    }

    console.log("설문 응답 데이터 로드 완료");
    return true;
  } catch (error) {
    console.error("설문 응답 데이터 로드 오류:", error);
    if (typeof window.hideLoadingIndicator === "function") {
      window.hideLoadingIndicator();
    }
    alert(
      `설문 응답 데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`
    );
    return false;
  }
}

// 전체 설문 수 업데이트 함수
function updateTotalSurveysCount() {
  const totalSurveysCount = surveyResponses.length;
  document.getElementById(
    "total-surveys-count"
  ).textContent = `${totalSurveysCount}개`;
}

// 설문 응답 렌더링 함수
function renderSurveyResponses() {
  const surveyResponsesBody = document.getElementById("survey-responses-body");
  console.log(
    "설문 응답 렌더링 시작",
    filteredSurveyResponses.length,
    "개의 응답"
  );

  if (!surveyResponsesBody) {
    console.error(
      "설문 응답 테이블을 찾을 수 없습니다: #survey-responses-body"
    );
    return;
  }

  if (filteredSurveyResponses.length === 0) {
    surveyResponsesBody.innerHTML = `
        <tr>
          <td colspan="12" class="loading-message">표시할 설문 응답이 없습니다.</td>
        </tr>
      `;
    updateSurveyPagination();
    return;
  }

  const startIndex = (currentSurveyPage - 1) * responsesPerPage;
  const endIndex = Math.min(
    startIndex + responsesPerPage,
    filteredSurveyResponses.length
  );
  const responsesToDisplay = filteredSurveyResponses.slice(
    startIndex,
    endIndex
  );

  surveyResponsesBody.innerHTML = "";

  responsesToDisplay.forEach((response) => {
    const row = document.createElement("tr");

    // 상태에 따른 배지 클래스 결정
    let statusClass = "";
    switch (response.status) {
      case "waiting":
        statusClass = "status-waiting";
        break;
      case "matched":
        statusClass = "status-matched";
        break;
      case "pending":
        statusClass = "status-pending";
        break;
      default:
        statusClass = "status-waiting";
    }

    // 상태에 따른 한글 텍스트
    let statusText = "";
    switch (response.status) {
      case "waiting":
        statusText = "대기 중";
        break;
      case "matched":
        statusText = "매칭됨";
        break;
      case "pending":
        statusText = "보류";
        break;
      default:
        statusText = "대기 중";
    }

    row.innerHTML = `
        <td>${response.name}</td>
        <td>${response.studentId}</td>
        <td>${response.mbti}</td>
        <td>${response.interest}</td>
        <td>${response.communicationStyle}</td>
        <td>${response.conflictResponse}</td>
        <td>${response.preferredRole}</td>
        <td>${response.preferredTeamMood}</td>
        <td>${response.selfKeywords}</td>
        <td>${response.matchingPreference}</td>
        <td>${response.submittedAt}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
      `;

    surveyResponsesBody.appendChild(row);
  });

  updateSurveyPagination();
}

// 설문 응답 페이지네이션 업데이트
function updateSurveyPagination() {
  const totalPages = Math.ceil(
    filteredSurveyResponses.length / responsesPerPage
  );
  const pageInfoElement = document.getElementById("survey-page-info");
  const prevPageBtn = document.getElementById("survey-prev-page");
  const nextPageBtn = document.getElementById("survey-next-page");

  if (pageInfoElement) {
    pageInfoElement.textContent = `페이지 ${currentSurveyPage} / ${
      totalPages || 1
    }`;
  }

  if (prevPageBtn) {
    prevPageBtn.disabled = currentSurveyPage <= 1;
  }

  if (nextPageBtn) {
    nextPageBtn.disabled = currentSurveyPage >= totalPages || totalPages === 0;
  }
}

// 설문 응답 필터 적용
function applySurveyFilters() {
  console.log("설문 필터 적용 중...");
  const mbtiValue = document.getElementById("filter-mbti").value;
  const interestValue = document.getElementById("filter-interest").value;
  const communicationValue = document.getElementById(
    "filter-communication"
  ).value;
  const conflictValue = document.getElementById("filter-conflict").value;
  const roleValue = document.getElementById("filter-role").value;
  const teamMoodValue = document.getElementById("filter-team-mood").value;
  const keywordsValue = document.getElementById("filter-keywords").value;
  const matchingValue = document.getElementById("filter-matching").value;

  console.log("필터 값:", {
    mbti: mbtiValue,
    interest: interestValue,
    communication: communicationValue,
    conflict: conflictValue,
    role: roleValue,
    teamMood: teamMoodValue,
    keywords: keywordsValue,
    matching: matchingValue,
  });

  filteredSurveyResponses = surveyResponses.filter((response) => {
    const mbtiMatch = mbtiValue === "" || response.mbti === mbtiValue;
    const interestMatch =
      interestValue === "" || response.interest === interestValue;
    const communicationMatch =
      communicationValue === "" ||
      response.communicationStyle === communicationValue;
    const conflictMatch =
      conflictValue === "" || response.conflictResponse === conflictValue;
    const roleMatch = roleValue === "" || response.preferredRole === roleValue;
    const teamMoodMatch =
      teamMoodValue === "" || response.preferredTeamMood === teamMoodValue;
    const keywordsMatch =
      keywordsValue === "" || response.selfKeywords.includes(keywordsValue);
    const matchingMatch =
      matchingValue === "" || response.matchingPreference === matchingValue;

    return (
      mbtiMatch &&
      interestMatch &&
      communicationMatch &&
      conflictMatch &&
      roleMatch &&
      teamMoodMatch &&
      keywordsMatch &&
      matchingMatch
    );
  });

  console.log("필터링 결과:", filteredSurveyResponses.length, "개의 응답");
  currentSurveyPage = 1;
  renderSurveyResponses();
}

// 설문 통계 업데이트 함수
function updateSurveyStats(surveys) {
  const totalSurveysCount = surveys.length;
  const activeSurveysCount = surveys.filter(
    (survey) => survey.status === "active"
  ).length;
  const completedSurveysCount = surveys.filter(
    (survey) => survey.status === "completed"
  ).length;

  document.getElementById(
    "total-surveys-count"
  ).textContent = `${totalSurveysCount}개`;
  if (document.getElementById("active-surveys-count")) {
    document.getElementById(
      "active-surveys-count"
    ).textContent = `${activeSurveysCount}개`;
  }
  if (document.getElementById("completed-surveys-count")) {
    document.getElementById(
      "completed-surveys-count"
    ).textContent = `${completedSurveysCount}개`;
  }
}

// 설문 테이블 업데이트 함수
function updateSurveyTable(surveys) {
  const surveyTableBody = document.getElementById("survey-list-body");

  if (!surveyTableBody) {
    console.error("설문 테이블을 찾을 수 없습니다.");
    return;
  }

  // 테이블 초기화
  surveyTableBody.innerHTML = "";

  // 설문 데이터로 테이블 채우기
  surveys.forEach((survey) => {
    const row = document.createElement("tr");

    // 설문 상태에 따른 배지 클래스 결정
    const statusClass = survey.status === "active" ? "active" : "completed";
    const statusText = survey.status === "active" ? "진행 중" : "완료";

    // 종료 여부에 따른 배지 클래스 결정
    const endedClass = survey.isEnded ? "completed" : "pending";
    const endedText = survey.isEnded ? "종료됨" : "진행 중";

    // 게임 시작 여부에 따른 배지 클래스 결정
    const gameClass = survey.gameStarted ? "active" : "inactive";
    const gameText = survey.gameStarted ? "시작됨" : "대기 중";

    row.innerHTML = `
        <td><input type="checkbox" class="select-survey"></td>
        <td>${survey.id}</td>
        <td>${survey.title}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td><span class="status-badge ${endedClass}">${endedText}</span></td>
        <td><span class="status-badge ${gameClass}">${gameText}</span></td>
        <td>
          <div class="action-buttons">
            <button class="end-survey-btn ${
              survey.isEnded ? "disabled-btn" : ""
            }" 
                    data-survey-id="${survey.id}" 
                    data-survey-title="${survey.title}"
                    ${survey.isEnded ? "disabled" : ""}>
              <i class="fas fa-stop-circle"></i> 설문 종료
            </button>
            <button class="start-game-btn ${
              !survey.isEnded || survey.gameStarted ? "disabled-btn" : ""
            }" 
                    data-survey-id="${survey.id}" 
                    data-survey-title="${survey.title}"
                    ${!survey.isEnded || survey.gameStarted ? "disabled" : ""}>
              <i class="fas fa-play-circle"></i> 게임 시작
            </button>
          </div>
        </td>
      `;

    surveyTableBody.appendChild(row);
  });

  // 설문 종료 버튼 이벤트 리스너 추가
  const endSurveyBtns = document.querySelectorAll(
    "#surveys-section .end-survey-btn:not(.disabled-btn)"
  );

  endSurveyBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const surveyId = this.getAttribute("data-survey-id");
      const surveyTitle = this.getAttribute("data-survey-title");

      if (typeof window.showConfirmModal === "function") {
        window.showConfirmModal(
          `"${surveyTitle}" 설문을 종료하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
          () => {
            if (typeof endSurvey === "function") {
              endSurvey(surveyId);
            }
          }
        );
      }
    });
  });

  // 게임 시작 버튼 이벤트 리스너 추가
  const startGameBtns = document.querySelectorAll(
    "#surveys-section .start-game-btn:not(.disabled-btn)"
  );

  startGameBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const surveyId = this.getAttribute("data-survey-id");
      const surveyTitle = this.getAttribute("data-survey-title");

      if (typeof window.showConfirmModal === "function") {
        window.showConfirmModal(
          `"${surveyTitle}" 관련 게임을 시작하시겠습니까? 모든 사용자가 게임 페이지로 이동합니다.`,
          () => {
            if (typeof startGame === "function") {
              startGame(surveyId);
            }
          }
        );
      }
    });
  });

  // 전체 선택 체크박스 이벤트 리스너 추가
  const selectAllCheckbox = document.getElementById("select-all-surveys");
  const selectItemCheckboxes = document.querySelectorAll(
    "#surveys-section .select-survey"
  );

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", function () {
      selectItemCheckboxes.forEach((checkbox) => {
        checkbox.checked = this.checked;
      });
    });
  }
}

// 설문 패널 초기화 함수
function initializeSurveyPanel() {
  console.log("설문 패널 초기화 중...");

  // 설문 필터 이벤트 리스너
  const filterSelects = document.querySelectorAll(".survey-filter");
  const applyFiltersBtn = document.getElementById("apply-survey-filters");

  // 검색 버튼 이벤트 리스너
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      console.log("검색 버튼 클릭됨");
      applySurveyFilters();
    });
  } else {
    console.error("검색 버튼을 찾을 수 없습니다: #apply-survey-filters");
  }

  // 페이지네이션 이벤트 리스너
  const prevPageBtn = document.getElementById("survey-prev-page");
  const nextPageBtn = document.getElementById("survey-next-page");

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentSurveyPage > 1) {
        currentSurveyPage--;
        renderSurveyResponses();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(
        filteredSurveyResponses.length / responsesPerPage
      );
      if (currentSurveyPage < totalPages) {
        currentSurveyPage++;
        renderSurveyResponses();
      }
    });
  }

  // 새로고침 버튼 이벤트 리스너 추가
  const refreshSurveysBtn = document.getElementById("refresh-surveys-btn");

  if (refreshSurveysBtn) {
    refreshSurveysBtn.addEventListener("click", () => {
      // 테스트를 위해 로딩 표시
      if (typeof window.showLoadingIndicator === "function") {
        window.showLoadingIndicator();
      }

      // 약간의 지연 후 데이터 로드 (로딩 효과를 보기 위함)
      setTimeout(() => {
        loadSurveyResponses();
      }, 500);
    });
  }

  console.log("설문 패널 초기화 완료");
}

// endSurvey와 startGame 함수를 전역 스코프에 선언 (또는 필요한 경우 import)
let endSurvey;
let startGame;

// DOM이 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  console.log("AdminPage-surveys.js DOMContentLoaded 이벤트 발생");

  // 초기화 함수 호출
  initializeSurveyPanel();

  // 전역 스코프에 함수 노출
  window.loadSurveyResponses = loadSurveyResponses;
  window.updateSurveyTable = updateSurveyTable;
  window.updateSurveyStats = updateSurveyStats;
  console.log("loadSurveyResponses 함수가 전역 스코프에 노출됨");

  // 초기 데이터 로드
  setTimeout(() => {
    console.log("초기 데이터 로드 시도");
    loadSurveyResponses();
  }, 500);
});

// 전역 스코프에 함수 노출
window.loadSurveyResponses = loadSurveyResponses;
window.updateSurveyTable = updateSurveyTable;
window.updateSurveyStats = updateSurveyStats;
console.log("loadSurveyResponses 함수가 전역 스코프에 노출됨 (파일 끝)");
