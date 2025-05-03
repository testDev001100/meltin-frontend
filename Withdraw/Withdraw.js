document.addEventListener("DOMContentLoaded", function () {
  // 폼 및 입력 요소 가져오기
  const form = document.getElementById("withdraw-form");
  const passwordInput = document.getElementById("password");
  const reasonSelect = document.getElementById("reason");
  const confirmCheckbox = document.getElementById("confirm-withdraw");
  const errorMessage = document.getElementById("error-message");

  // 폼 제출 이벤트 처리
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // 에러 메시지 초기화
    errorMessage.textContent = "";

    // 입력값 검증
    if (!passwordInput.value.trim()) {
      errorMessage.textContent = "비밀번호를 입력해주세요.";
      passwordInput.focus();
      return;
    }

    if (!confirmCheckbox.checked) {
      errorMessage.textContent = "회원 탈퇴 동의에 체크해주세요.";
      return;
    }

    // 사용자에게 최종 확인
    const confirmed = confirm(
      "정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
    );
    if (!confirmed) {
      return;
    }

    // 모든 검증 통과 시 백엔드로 데이터 전송
    await sendWithdrawRequest(passwordInput.value, reasonSelect.value);
  });

  // 백엔드로 회원 탈퇴 요청 보내는 함수
  async function sendWithdrawRequest(password, reason) {
    try {
      // 로컬 스토리지에서 토큰 가져오기
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
        submitButton.textContent = "처리 중...";
      }

      const response = await fetch(
        "http://192.168.123.100:8080/api/users/withdraw",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: password,
            reason: reason || "미입력",
          }),
        }
      );

      // 응답이 성공적이지 않으면 에러 처리
      if (!response.ok) {
        let errorMsg = "회원 탈퇴에 실패했습니다.";

        // JSON 응답이 있을 때만 처리
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          console.error("JSON 파싱 오류:", e);
          // JSON 파싱 실패 시에도 기본 오류 메시지를 사용
        }

        throw new Error(errorMsg);
      }

      // 회원 탈퇴 성공 처리
      alert(
        "회원 탈퇴가 완료되었습니다. 그동안 서비스를 이용해주셔서 감사합니다."
      );

      // 로컬 스토리지 토큰 삭제
      localStorage.removeItem("token");

      // 로그인 페이지로 리다이렉트
      window.location.href = "../Login/Login.html";
    } catch (error) {
      // 에러 메시지 출력
      errorMessage.textContent = error.message;
      console.error("회원 탈퇴 오류:", error);

      // 버튼 상태 복원
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "회원 탈퇴";
      }
    }
  }

  // 입력 필드 변경 시 에러 메시지 초기화
  passwordInput.addEventListener("input", clearError);
  confirmCheckbox.addEventListener("change", clearError);

  function clearError() {
    errorMessage.textContent = "";
  }
});
