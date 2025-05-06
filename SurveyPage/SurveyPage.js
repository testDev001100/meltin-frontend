document.addEventListener("DOMContentLoaded", function () {
  // 페이지 로드 시 즉시 토큰 확인
  const token = localStorage.getItem("token");
  if (!token) {
    alert("설문조사에 참여하려면 로그인이 필요합니다.");
    window.location.href = "../LogInPage/LogInPage.html"; // 로그인 페이지로 즉시 리다이렉트
    return;
  }

  // 폼 및 입력 요소 가져오기
  const form = document.getElementById("survey-form");
  const mbtiSelect = document.getElementById("mbti");
  const interestSelect = document.getElementById("interest");
  const communicationStyleSelect =
    document.getElementById("communicationStyle");
  const conflictResponseSelect = document.getElementById("conflictResponse");
  const preferredRoleSelect = document.getElementById("preferredRole");
  const preferredTeamMoodSelect = document.getElementById("preferredTeamMood");
  const selfKeywordsSelect = document.getElementById("selfKeywords");
  const matchingPreferenceSelect =
    document.getElementById("matchingPreference");
  const errorMessage = document.getElementById("error-message");

  // 폼 제출 이벤트 처리
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // 에러 메시지 초기화
    errorMessage.textContent = "";

    // 입력값 검증
    if (!mbtiSelect.value) {
      errorMessage.textContent = "MBTI를 선택해주세요.";
      mbtiSelect.focus();
      return;
    }

    if (!interestSelect.value) {
      errorMessage.textContent = "관심주제를 선택해주세요.";
      interestSelect.focus();
      return;
    }

    if (!communicationStyleSelect.value) {
      errorMessage.textContent = "소통스타일을 선택해주세요.";
      communicationStyleSelect.focus();
      return;
    }

    if (!conflictResponseSelect.value) {
      errorMessage.textContent = "갈등대처 방식을 선택해주세요.";
      conflictResponseSelect.focus();
      return;
    }

    if (!preferredRoleSelect.value) {
      errorMessage.textContent = "선호역할을 선택해주세요.";
      preferredRoleSelect.focus();
      return;
    }

    if (!preferredTeamMoodSelect.value) {
      errorMessage.textContent = "선호 팀 분위기를 선택해주세요.";
      preferredTeamMoodSelect.focus();
      return;
    }

    if (!selfKeywordsSelect.value) {
      errorMessage.textContent = "자신을 표현하는 키워드를 선택해주세요.";
      selfKeywordsSelect.focus();
      return;
    }

    if (!matchingPreferenceSelect.value) {
      errorMessage.textContent = "매칭 선호를 선택해주세요.";
      matchingPreferenceSelect.focus();
      return;
    }

    window.location.href = "../LoadingPage/LoadingPage.html";
    // 모든 검증 통과 시 백엔드로 데이터 전송
    await sendSurveyData();
  });

  // 백엔드로 설문조사 데이터 전송하는 함수
  async function sendSurveyData() {
    try {
      // 토큰 확인
      const token = localStorage.getItem("token");

      if (!token) {
        errorMessage.textContent = "인증 정보가 없습니다. 다시 로그인해주세요.";
        setTimeout(() => {
          window.location.href = "../Login/Login.html"; // 로그인 페이지로 리다이렉트
        }, 2000);
        return;
      }

      // 버튼 비활성화 및 로딩 상태 표시
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "제출 중...";
      }

      // 설문조사 데이터 준비
      const surveyData = {
        mbti: mbtiSelect.value,
        interest: interestSelect.value,
        communicationStyle: communicationStyleSelect.value,
        conflictResponse: conflictResponseSelect.value,
        preferredRole: preferredRoleSelect.value,
        preferredTeamMood: preferredTeamMoodSelect.value,
        selfKeywords: selfKeywordsSelect.value,
        matchingPreference: matchingPreferenceSelect.value,
      };

      const response = await fetch("https://meltin.shop/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 토큰 형식 일치
        },
        body: JSON.stringify(surveyData),
      });

      // 응답이 성공적이지 않으면 에러 처리
      if (!response.ok) {
        const errorText = await response.text();
        console.error("서버 에러 응답:", errorText);

        // HTTP 상태 코드에 따른 처리
        if (response.status === 401) {
          alert("인증이 만료되었습니다. 다시 로그인해주세요.");
          localStorage.removeItem("token"); // 토큰 삭제
          window.location.href = "../Login/Login.html";
          return;
        }

        throw new Error("설문조사 제출에 실패했습니다.");
      }

      // 설문조사 제출 성공 처리
      alert("설문조사가 성공적으로 제출되었습니다.");
      localStorage.setItem(
        "studentId",
        document.getElementById("studentId").value
      );
      window.location.href = "../LoadingPage/LoadingPage.html"; // 메인페이지로 리다이렉트
    } catch (error) {
      // 에러 메시지 출력
      errorMessage.textContent = error.message;
      console.error("에러 발생:", error);

      // 버튼 상태 복원
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "제출하기";
      }
    }
  }

  // 셀렉트 박스 변경 시 에러 메시지 초기화
  const allSelects = document.querySelectorAll("select");
  allSelects.forEach((select) => {
    select.addEventListener("change", clearError);
  });

  function clearError() {
    errorMessage.textContent = "";
  }

  // 취소 버튼 이벤트 리스너 (선택적)
  const cancelButton = document.querySelector(".btn.cancel");
  if (cancelButton) {
    cancelButton.addEventListener("click", function () {
      const confirmCancel = confirm(
        "설문조사를 취소하시겠습니까? 입력한 내용은 저장되지 않습니다."
      );
      if (confirmCancel) {
        window.location.href = "../MainPage/MainPage.html";
      }
    });
  }
});
