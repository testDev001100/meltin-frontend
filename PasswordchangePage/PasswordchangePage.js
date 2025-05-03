document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const errorMessage = document.getElementById("error-message");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "../LogInPage/LogInPage.html";
    return;
  }

  document.getElementById("password-change-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
      errorMessage.textContent = "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.";
      return;
    }

    try {
      const response = await fetch("http://192.168.123.100:8080/api/users/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        let errMsg = "비밀번호 변경에 실패했습니다.";
        try {
          const contentType = response.headers.get("Content-Type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            errMsg = data.message || errMsg;
          } else {
            const text = await response.text();
            console.error("응답본문 (text):", text);
          }
        } catch (e) {
          console.error("JSON 파싱 오류:", e);
        }
        throw new Error(errMsg);
      }

      alert("비밀번호가 성공적으로 변경되었습니다.");
      window.location.href = "../MyPage/MyPage.html";

    } catch (error) {
      errorMessage.textContent = error.message;
      console.error("비밀번호 변경 오류:", error);
    }
  });
});
