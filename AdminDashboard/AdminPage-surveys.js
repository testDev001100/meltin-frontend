// 전역 변수
let surveyResponses = [];
let filteredSurveyResponses = [];
let currentSurveyPage = 1;
const responsesPerPage = 10;

// Undeclared variables (assuming these are defined elsewhere or imported)
const showLoadingIndicator = () =>
  console.log("showLoadingIndicator placeholder");
const hideLoadingIndicator = () =>
  console.log("hideLoadingIndicator placeholder");
const showConfirmModal = (message, callback) => {
  console.log("showConfirmModal placeholder:", message);
  if (callback) {
    callback();
  }
};
const endSurvey = (surveyId) => console.log("endSurvey placeholder:", surveyId);
const startGame = (surveyId) => console.log("startGame placeholder:", surveyId);

// 설문 목록 로드 함수
async function loadSurveys() {
  try {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (!token || !adminToken) {
      throw new Error("인증 정보가 없습니다.");
    }

    // 로딩 표시
    showLoadingIndicator();

    // 설문 목록 가져오기 (테스트를 위해 API 호출 대신 더미 데이터 사용)
    // 실제 구현 시 아래 주석 해제
    /*
    const response = await fetch('http://192.168.123.100:8080/api/admin/surveys', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Admin-Token': adminToken
      }
    });
    
    if (!response.ok) {
      throw new Error('설문 데이터 로드 실패');
    }
    
    const surveys = await response.json();
    */

    // 테스트용 더미 데이터
    const surveys = [
      {
        id: 1,
        title: "2023년 1학기 프로젝트 팀 매칭 설문",
        status: "active",
        isEnded: false,
        gameStarted: false,
      },
      {
        id: 2,
        title: "2023년 2학기 프로젝트 팀 매칭 설문",
        status: "active",
        isEnded: false,
        gameStarted: false,
      },
      {
        id: 3,
        title: "2022년 2학기 프로젝트 팀 매칭 설문",
        status: "completed",
        isEnded: true,
        gameStarted: true,
      },
      {
        id: 4,
        title: "2022년 1학기 프로젝트 팀 매칭 설문",
        status: "completed",
        isEnded: true,
        gameStarted: true,
      },
      {
        id: 5,
        title: "2024년 1학기 프로젝트 팀 매칭 설문 (예정)",
        status: "active",
        isEnded: false,
        gameStarted: false,
      },
    ];

    // 설문 테이블 업데이트
    updateSurveyTable(surveys);

    // 설문 통계 업데이트
    updateSurveyStats(surveys);

    // 설문 응답 데이터 로드
    await loadSurveyResponses();

    // 로딩 숨기기
    hideLoadingIndicator();
  } catch (error) {
    console.error("설문 데이터 로드 오류:", error);
    hideLoadingIndicator();
    alert(`설문 데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`);
  }
}

// 설문 응답 데이터 로드 함수
async function loadSurveyResponses() {
  try {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (!token || !adminToken) {
      throw new Error("인증 정보가 없습니다.");
    }

    // 로딩 표시
    showLoadingIndicator();

    // 설문 응답 데이터 가져오기 (테스트를 위해 API 호출 대신 더미 데이터 사용)
    // 실제 구현 시 아래 주석 해제
    /*
    const response = await fetch('http://192.168.123.100:8080/api/admin/survey-responses', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Admin-Token': adminToken
      }
    });
    
    if (!response.ok) {
      throw new Error('설문 응답 데이터 로드 실패');
    }
    
    const responses = await response.json();
    */

    // 테스트용 더미 데이터 - 제공된 HTML의 옵션 값을 사용하여 업데이트
    const responses = [
      {
        id: 1,
        name: "김철수",
        studentId: "20230001",
        mbti: "ENFP",
        interest: "기술",
        communicationStyle: "직접적이고 명확하게 말하기",
        conflictResponse: "논리적으로 해결하기",
        preferredRole: "리더",
        preferredTeamMood: "열정적이고 동기 부여가 되는 분위기",
        selfKeywords: "창의적, 책임감 있는",
        matchingPreference: "비슷한 성격의 사람과 함께 일하는 것",
        submittedAt: "2023-09-01 14:30:22",
        status: "waiting",
      },
      {
        id: 2,
        name: "이영희",
        studentId: "20230002",
        mbti: "INTJ",
        interest: "디자인",
        communicationStyle: "논리적으로 설명하기",
        conflictResponse: "감정을 고려하여 해결하기",
        preferredRole: "아이디어 제시자",
        preferredTeamMood: "편안하고 자유로운 분위기",
        selfKeywords: "분석적, 창의적",
        matchingPreference: "서로 다른 성격의 사람들과 협력하는 것",
        submittedAt: "2023-09-01 15:45:10",
        status: "matched",
      },
      {
        id: 3,
        name: "박지민",
        studentId: "20230003",
        mbti: "ESFP",
        interest: "마케팅",
        communicationStyle: "감정적으로 연결되기",
        conflictResponse: "타협하기",
        preferredRole: "조정자",
        preferredTeamMood: "협력적이고 팀워크가 중요한 분위기",
        selfKeywords: "협력적, 유머러스한",
        matchingPreference: "유사한 관심사와 목표를 가진 사람들과 일하는 것",
        submittedAt: "2023-09-02 09:15:33",
        status: "matched",
      },
      {
        id: 4,
        name: "최민준",
        studentId: "20230004",
        mbti: "ISTP",
        interest: "헬스케어",
        communicationStyle: "이야기나 비유를 통해 전달하기",
        conflictResponse: "대화를 통해 해결하기",
        preferredRole: "실행자",
        preferredTeamMood: "목표 지향적이고 성과를 중시하는 분위기",
        selfKeywords: "도전적인, 자율적인",
        matchingPreference: "다양한 시각을 존중하며 일하는 것",
        submittedAt: "2023-09-02 11:20:45",
        status: "pending",
      },
      {
        id: 5,
        name: "정수빈",
        studentId: "20230005",
        mbti: "ENFP",
        interest: "사회적 문제 해결",
        communicationStyle: "직접적이고 명확하게 말하기",
        conflictResponse: "피하는 편이다",
        preferredRole: "분석가",
        preferredTeamMood: "편안하고 자유로운 분위기",
        selfKeywords: "배려 깊은, 적극적인",
        matchingPreference: "비슷한 성격의 사람과 함께 일하는 것",
        submittedAt: "2023-09-03 13:10:05",
        status: "waiting",
      },
      {
        id: 6,
        name: "강지훈",
        studentId: "20230006",
        mbti: "ISTJ",
        interest: "환경",
        communicationStyle: "논리적으로 설명하기",
        conflictResponse: "논리적으로 해결하기",
        preferredRole: "서포터",
        preferredTeamMood: "협력적이고 팀워크가 중요한 분위기",
        selfKeywords: "책임감 있는, 분석적",
        matchingPreference: "서로 다른 성격의 사람들과 협력하는 것",
        submittedAt: "2023-09-03 14:25:18",
        status: "waiting",
      },
      {
        id: 7,
        name: "윤서연",
        studentId: "20230007",
        mbti: "ENFJ",
        interest: "문화/예술",
        communicationStyle: "감정적으로 연결되기",
        conflictResponse: "감정을 고려하여 해결하기",
        preferredRole: "리더",
        preferredTeamMood: "열정적이고 동기 부여가 되는 분위기",
        selfKeywords: "창의적, 협력적",
        matchingPreference: "유사한 관심사와 목표를 가진 사람들과 일하는 것",
        submittedAt: "2023-09-04 10:05:30",
        status: "matched",
      },
      {
        id: 8,
        name: "임준호",
        studentId: "20230008",
        mbti: "INTP",
        interest: "경제",
        communicationStyle: "이야기나 비유를 통해 전달하기",
        conflictResponse: "타협하기",
        preferredRole: "아이디어 제시자",
        preferredTeamMood: "목표 지향적이고 성과를 중시하는 분위기",
        selfKeywords: "분석적, 자율적인",
        matchingPreference: "다양한 시각을 존중하며 일하는 것",
        submittedAt: "2023-09-04 11:45:22",
        status: "waiting",
      },
      {
        id: 9,
        name: "한미나",
        studentId: "20230009",
        mbti: "ESFJ",
        interest: "심리학",
        communicationStyle: "직접적이고 명확하게 말하기",
        conflictResponse: "대화를 통해 해결하기",
        preferredRole: "조정자",
        preferredTeamMood: "협력적이고 팀워크가 중요한 분위기",
        selfKeywords: "배려 깊은, 책임감 있는",
        matchingPreference: "비슷한 성격의 사람과 함께 일하는 것",
        submittedAt: "2023-09-05 09:30:15",
        status: "pending",
      },
      {
        id: 10,
        name: "오태양",
        studentId: "20230010",
        mbti: "ENTJ",
        interest: "교육",
        communicationStyle: "논리적으로 설명하기",
        conflictResponse: "논리적으로 해결하기",
        preferredRole: "리더",
        preferredTeamMood: "목표 지향적이고 성과를 중시하는 분위기",
        selfKeywords: "도전적인, 적극적인",
        matchingPreference: "서로 다른 성격의 사람들과 협력하는 것",
        submittedAt: "2023-09-05 14:15:40",
        status: "waiting",
      },
    ];

    // 설문 응답 데이터 저장
    surveyResponses = responses;
    filteredSurveyResponses = [...responses];

    // 설문 응답 테이블 업데이트
    renderSurveyResponses();

    // 로딩 숨기기
    hideLoadingIndicator();
  } catch (error) {
    console.error("설문 응답 데이터 로드 오류:", error);
    hideLoadingIndicator();
    alert(
      `설문 응답 데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`
    );
  }
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
  document.getElementById(
    "active-surveys-count"
  ).textContent = `${activeSurveysCount}개`;
  document.getElementById(
    "completed-surveys-count"
  ).textContent = `${completedSurveysCount}개`;
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

      showConfirmModal(
        `"${surveyTitle}" 설문을 종료하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
        () => {
          endSurvey(surveyId);
        }
      );
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

      showConfirmModal(
        `"${surveyTitle}" 관련 게임을 시작하시겠습니까? 모든 사용자가 게임 페이지로 이동합니다.`,
        () => {
          startGame(surveyId);
        }
      );
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

// 설문 응답 렌더링 함수
function renderSurveyResponses() {
  const surveyResponsesBody = document.getElementById("survey-responses-body");

  if (!surveyResponsesBody) {
    console.error("설문 응답 테이블을 찾을 수 없습니다.");
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

  currentSurveyPage = 1;
  renderSurveyResponses();
}

// 페이지 로드 시 이벤트 리스너 추가
document.addEventListener("DOMContentLoaded", () => {
  // 설문 필터 이벤트 리스너
  const filterSelects = document.querySelectorAll(".survey-filter");
  const clearFiltersBtn = document.getElementById("clear-survey-filters");

  filterSelects.forEach((select) => {
    select.addEventListener("change", applySurveyFilters);
  });

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      filterSelects.forEach((select) => {
        select.value = "";
      });
      filteredSurveyResponses = [...surveyResponses];
      currentSurveyPage = 1;
      renderSurveyResponses();
    });
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
  const refreshSurveyListBtn = document.getElementById(
    "refresh-survey-list-btn"
  );

  if (refreshSurveysBtn) {
    refreshSurveysBtn.addEventListener("click", loadSurveyResponses);
  }

  if (refreshSurveyListBtn) {
    refreshSurveyListBtn.addEventListener("click", loadSurveys);
  }
});
