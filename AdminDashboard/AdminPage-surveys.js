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

    if (typeof window.showLoadingIndicator === "function") {
      window.showLoadingIndicator();
    }

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("인증 정보가 없습니다.");
    }

    const response = await fetch(`${API_BASE_URL}/admin/surveys`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
    filteredSurveyResponses = [...surveyResponses];

    renderSurveyResponses();
    updateTotalSurveysCount();

    if (typeof window.hideLoadingIndicator === "function") {
      window.hideLoadingIndicator();
    }

    return true;
  } catch (error) {
    console.error("설문 응답 데이터 로드 오류:", error);
    if (typeof window.hideLoadingIndicator === "function") {
      window.hideLoadingIndicator();
    }
    alert(`설문 응답 데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`);
    return false;
  }
}

// 이하의 함수들은 원래대로 유지 (렌더링, 필터, 페이징 등)
function updateTotalSurveysCount() {
  const totalSurveysCount = surveyResponses.length;
  document.getElementById("total-surveys-count").textContent = `${totalSurveysCount}개`;
}

function renderSurveyResponses() {
  const surveyResponsesBody = document.getElementById("survey-responses-body");

  if (!surveyResponsesBody) {
    console.error("설문 응답 테이블을 찾을 수 없습니다: #survey-responses-body");
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
  const endIndex = Math.min(startIndex + responsesPerPage, filteredSurveyResponses.length);
  const responsesToDisplay = filteredSurveyResponses.slice(startIndex, endIndex);

  surveyResponsesBody.innerHTML = "";

  responsesToDisplay.forEach((response) => {
    const row = document.createElement("tr");

    let statusClass = response.status === "matched" ? "status-matched" :
                      response.status === "pending" ? "status-pending" : "status-waiting";
    let statusText = response.status === "matched" ? "매칭됨" :
                     response.status === "pending" ? "보류" : "대기 중";

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

function updateSurveyPagination() {
  const totalPages = Math.ceil(filteredSurveyResponses.length / responsesPerPage);
  const pageInfoElement = document.getElementById("survey-page-info");
  const prevPageBtn = document.getElementById("survey-prev-page");
  const nextPageBtn = document.getElementById("survey-next-page");

  if (pageInfoElement) {
    pageInfoElement.textContent = `페이지 ${currentSurveyPage} / ${totalPages || 1}`;
  }

  if (prevPageBtn) prevPageBtn.disabled = currentSurveyPage <= 1;
  if (nextPageBtn) nextPageBtn.disabled = currentSurveyPage >= totalPages || totalPages === 0;
}

function applySurveyFilters() {
  const mbtiValue = document.getElementById("filter-mbti").value;
  const interestValue = document.getElementById("filter-interest").value;
  const communicationValue = document.getElementById("filter-communication").value;
  const conflictValue = document.getElementById("filter-conflict").value;
  const roleValue = document.getElementById("filter-role").value;
  const teamMoodValue = document.getElementById("filter-team-mood").value;
  const keywordsValue = document.getElementById("filter-keywords").value;
  const matchingValue = document.getElementById("filter-matching").value;

  filteredSurveyResponses = surveyResponses.filter((response) => {
    return (
      (mbtiValue === "" || response.mbti === mbtiValue) &&
      (interestValue === "" || response.interest === interestValue) &&
      (communicationValue === "" || response.communicationStyle === communicationValue) &&
      (conflictValue === "" || response.conflictResponse === conflictValue) &&
      (roleValue === "" || response.preferredRole === roleValue) &&
      (teamMoodValue === "" || response.preferredTeamMood === teamMoodValue) &&
      (keywordsValue === "" || response.selfKeywords.includes(keywordsValue)) &&
      (matchingValue === "" || response.matchingPreference === matchingValue)
    );
  });

  currentSurveyPage = 1;
  renderSurveyResponses();
}

// 설문 패널 초기화 및 전역 등록
function initializeSurveyPanel() {
  const applyFiltersBtn = document.getElementById("apply-survey-filters");
  if (applyFiltersBtn) applyFiltersBtn.addEventListener("click", applySurveyFilters);

  document.getElementById("survey-prev-page")?.addEventListener("click", () => {
    if (currentSurveyPage > 1) {
      currentSurveyPage--;
      renderSurveyResponses();
    }
  });

  document.getElementById("survey-next-page")?.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredSurveyResponses.length / responsesPerPage);
    if (currentSurveyPage < totalPages) {
      currentSurveyPage++;
      renderSurveyResponses();
    }
  });

  document.getElementById("refresh-surveys-btn")?.addEventListener("click", () => {
    if (typeof window.showLoadingIndicator === "function") {
      window.showLoadingIndicator();
    }
    setTimeout(() => {
      loadSurveyResponses();
    }, 500);
  });
}

// DOM 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
  initializeSurveyPanel();
  window.loadSurveyResponses = loadSurveyResponses;
  window.updateSurveyTable = () => {};
  window.updateSurveyStats = () => {};
  setTimeout(() => {
    loadSurveyResponses();
  }, 500);
});
