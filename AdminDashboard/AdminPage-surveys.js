// 전역 변수
let surveyResponses = [];
let filteredSurveyResponses = [];
let currentSurveyPage = 1;
const responsesPerPage = 10;

// 설문 응답 데이터 로드 함수
function loadSurveyResponses() {
  try {
    console.log("설문 응답 데이터 로드 함수 호출됨");

    // 로딩 표시
    if (typeof window.showLoadingIndicator === "function") {
      window.showLoadingIndicator();
    } else {
      console.error("showLoadingIndicator 함수를 찾을 수 없습니다.");
    }

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
        status: "waiting",
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
        status: "waiting",
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
      {
        id: 11,
        name: "신동훈",
        studentId: "20230011",
        mbti: "ISFP",
        interest: "기술",
        communicationStyle: "감정적으로 연결되기",
        conflictResponse: "피하는 편이다",
        preferredRole: "실행자",
        preferredTeamMood: "편안하고 자유로운 분위기",
        selfKeywords: "창의적, 유머러스한",
        matchingPreference: "비슷한 성격의 사람과 함께 일하는 것",
        submittedAt: "2023-09-06 10:20:15",
        status: "waiting",
      },
      {
        id: 12,
        name: "장하은",
        studentId: "20230012",
        mbti: "ESTJ",
        interest: "마케팅",
        communicationStyle: "직접적이고 명확하게 말하기",
        conflictResponse: "논리적으로 해결하기",
        preferredRole: "리더",
        preferredTeamMood: "목표 지향적이고 성과를 중시하는 분위기",
        selfKeywords: "책임감 있는, 적극적인",
        matchingPreference: "다양한 시각을 존중하며 일하는 것",
        submittedAt: "2023-09-06 11:30:45",
        status: "matched",
      },
      {
        id: 13,
        name: "김민석",
        studentId: "20230013",
        mbti: "INFJ",
        interest: "환경",
        communicationStyle: "이야기나 비유를 통해 전달하기",
        conflictResponse: "감정을 고려하여 해결하기",
        preferredRole: "아이디어 제시자",
        preferredTeamMood: "협력적이고 팀워크가 중요한 분위기",
        selfKeywords: "배려 깊은, 창의적",
        matchingPreference: "유사한 관심사와 목표를 가진 사람들과 일하는 것",
        submittedAt: "2023-09-07 09:15:30",
        status: "waiting",
      },
      {
        id: 14,
        name: "이지은",
        studentId: "20230014",
        mbti: "ENTP",
        interest: "디자인",
        communicationStyle: "논리적으로 설명하기",
        conflictResponse: "타협하기",
        preferredRole: "분석가",
        preferredTeamMood: "열정적이고 동기 부여가 되는 분위기",
        selfKeywords: "도전적인, 분석적",
        matchingPreference: "서로 다른 성격의 사람들과 협력하는 것",
        submittedAt: "2023-09-07 14:45:20",
        status: "waiting",
      },
      {
        id: 15,
        name: "박준영",
        studentId: "20230015",
        mbti: "ISFJ",
        interest: "헬스케어",
        communicationStyle: "감정적으로 연결되기",
        conflictResponse: "대화를 통해 해결하기",
        preferredRole: "서포터",
        preferredTeamMood: "편안하고 자유로운 분위기",
        selfKeywords: "책임감 있는, 배려 깊은",
        matchingPreference: "비슷한 성격의 사람과 함께 일하는 것",
        submittedAt: "2023-09-08 10:30:15",
        status: "matched",
      },
    ];

    // 설문 응답 데이터 저장
    surveyResponses = responses;
    filteredSurveyResponses = [...responses];
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

// DOM이 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  console.log("AdminPage-surveys.js DOMContentLoaded 이벤트 발생");

  // 초기화 함수 호출
  initializeSurveyPanel();

  // 전역 스코프에 함수 노출
  window.loadSurveyResponses = loadSurveyResponses;
  console.log("loadSurveyResponses 함수가 전역 스코프에 노출됨");

  // 초기 데이터 로드
  setTimeout(() => {
    console.log("초기 데이터 로드 시도");
    loadSurveyResponses();
  }, 500);
});

// 전역 스코프에 함수 노출
window.loadSurveyResponses = loadSurveyResponses;
console.log("loadSurveyResponses 함수가 전역 스코프에 노출됨 (파일 끝)");
