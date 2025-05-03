document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

  // 로그인 상태 체크
  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "../LogInPage/LogInPage.html";
    return;
  }

  document
    .getElementById("password-change-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      // 폼 값 가져오기
      const currentPassword = document.getElementById("current-password").value;
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const errorMessage = document.getElementById("error-message");

      // 비밀번호 확인
      if (newPassword !== confirmPassword) {
        errorMessage.textContent =
          "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.";
        return;
      }

      try {
        // 백엔드로 PATCH 요청 보내기
        const response = await fetch(
          "http://192.168.123.100:8080/api/users/password",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              currentPassword: currentPassword, // 대문자 P 사용
              newPassword: newPassword, // 대문자 P 사용
            }),
          }
        );

        // 응답 처리
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "비밀번호 변경에 실패했습니다.");
        }

        alert("비밀번호가 성공적으로 변경되었습니다.");
        window.location.href = "../MyPage/MyPage.html"; // 비밀번호 변경 후 MyPage로 이동
      } catch (error) {
        errorMessage.textContent = error.message;
        console.error("비밀번호 변경 오류:", error);
      }
    });
});
