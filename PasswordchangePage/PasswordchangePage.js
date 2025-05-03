document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "../LogInPage/LogInPage.html";
    return;
  }

  document
    .getElementById("password-change-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const currentPassword = document.getElementById("current-password").value;
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      
      // 비밀번호 확인
      if (newPassword !== confirmPassword) {
        errorMessage.textContent =
          "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.";
        return;
      }

      try {
        const response = await fetch(
          "http://192.168.123.100:8080/api/users/password", // PATCH 요청을 보내는 URL
          {
            method: "PATCH", // PATCH로 변경
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Authorization 헤더에 Bearer 토큰 추가
            },
            body: JSON.stringify({
              currentPassword: currentPassword,
              newPassword: newPassword
            })
          }
        );

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
