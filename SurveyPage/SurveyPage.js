document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("survey-form");
  const keywordCheckboxes = document.querySelectorAll(".keyword-checkbox");
  const keywordError = document.getElementById("keyword-error");
  const formError = document.getElementById("form-error");
  const cancelBtn = document.getElementById("cancel-btn");

  // 키워드 체크박스 최대 3개 제한
  keywordCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const checkedCount = document.querySelectorAll(
        ".keyword-checkbox:checked"
      ).length;

      if (checkedCount > 3) {
        this.checked = false;
        keywordError.textContent = "키워드는 최대 3개까지 선택 가능합니다.";
      } else {
        keywordError.textContent = "";
      }
    });
  });

  // 폼 제출 이벤트 처리
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // 폼 유효성 검사
    if (validateForm()) {
      // 성공 메시지 표시
      formError.textContent = "설문이 성공적으로 제출되었습니다!";
      formError.style.color = "#2ecc71";

      // 폼 데이터 수집 및 처리
      const formData = collectFormData();
      console.log("제출된 데이터:", formData);

      // 폼 초기화 (3초 후)
      setTimeout(() => {
        form.reset();
        formError.textContent = "";
        // 실제 환경에서는 여기서 리다이렉트 처리
        alert("설문이 제출되었습니다. 감사합니다!");
      }, 3000);
    }
  });

  // 취소 버튼 이벤트 처리
  cancelBtn.addEventListener("click", () => {
    const isConfirmed = confirm(
      "설문을 취소하시겠습니까? 입력한 내용은 저장되지 않습니다."
    );

    if (isConfirmed) {
      form.reset();
      keywordError.textContent = "";
      formError.textContent = "";
      // 실제 환경에서는 이전 페이지로 이동
      alert("설문이 취소되었습니다.");
    }
  });

  // 폼 유효성 검사 함수
  function validateForm() {
    let isValid = true;
    formError.textContent = "";

    // MBTI 선택 확인
    const mbti = document.getElementById("mbti").value;
    if (!mbti) {
      isValid = false;
      formError.textContent = "MBTI를 선택해주세요.";
    }

    // 관심 주제 최소 1개 이상 선택 확인
    const interests = document.querySelectorAll(
      'input[name="interests"]:checked'
    );
    if (interests.length === 0) {
      isValid = false;
      formError.textContent = "관심 주제를 최소 1개 이상 선택해주세요.";
    }

    // 소통 스타일 선택 확인
    const communication = document.querySelector(
      'input[name="communication"]:checked'
    );
    if (!communication) {
      isValid = false;
      formError.textContent = "소통 스타일을 선택해주세요.";
    }

    // 갈등 대처 선택 확인
    const conflict = document.querySelector('input[name="conflict"]:checked');
    if (!conflict) {
      isValid = false;
      formError.textContent = "갈등 대처 방식을 선택해주세요.";
    }

    // 팀에서 선호 역할 선택 확인
    const role = document.querySelector('input[name="role"]:checked');
    if (!role) {
      isValid = false;
      formError.textContent = "팀에서 선호하는 역할을 선택해주세요.";
    }

    // 선호 팀 분위기 선택 확인
    const mood = document.querySelector('input[name="mood"]:checked');
    if (!mood) {
      isValid = false;
      formError.textContent = "선호하는 팀 분위기를 선택해주세요.";
    }

    // 키워드 최소 1개 이상 선택 확인
    const keywords = document.querySelectorAll(
      'input[name="keywords"]:checked'
    );
    if (keywords.length === 0) {
      isValid = false;
      formError.textContent =
        "자신을 표현하는 키워드를 최소 1개 이상 선택해주세요.";
    }

    // 성향 선호 선택 확인
    const preference = document.querySelector(
      'input[name="preference"]:checked'
    );
    if (!preference) {
      isValid = false;
      formError.textContent = "성향 선호를 선택해주세요.";
    }

    // 에러 메시지가 있으면 해당 위치로 스크롤
    if (!isValid) {
      formError.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return isValid;
  }

  // 폼 데이터 수집 함수
  function collectFormData() {
    const formData = {
      mbti: document.getElementById("mbti").value,
      interest: Array.from(
        document.querySelectorAll('input[name="interests"]:checked')
      )
        .map((el) => el.value)
        .join(", "),
      communicationStyle: document.querySelector(
        'input[name="communication"]:checked'
      ).value,
      conflictResponse: document.querySelector('input[name="conflict"]:checked')
        .value,
      preferredRole: document.querySelector('input[name="role"]:checked').value,
      preferredTeamMood: document.querySelector('input[name="mood"]:checked')
        .value,
      selfKeywords: Array.from(
        document.querySelectorAll('input[name="keywords"]:checked')
      )
        .map((el) => el.value)
        .join(", "),
      matchingPreference: document.querySelector(
        'input[name="preference"]:checked'
      ).value,
      submittedAt: new Date().toISOString(),
    };

    return formData;
  }
});
