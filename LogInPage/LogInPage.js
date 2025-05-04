document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(
        "http://192.168.123.100:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("서버 에러 응답:", errorText);
        alert("로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
        return;
      }

      // ✅ 헤더에서 토큰 추출
      const token = response.headers.get("Authorization");
      if (token) {
        localStorage.setItem("token", token);
        alert("로그인 성공!");
      } else {
        alert("로그인 성공 (토큰 없음)");
      }

      window.location.href = "../MainPage/MainPage.html";
    } catch (error) {
      console.error("에러 발생:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  const signup = document.getElementById("signup");

  if (signup) {
    signup.addEventListener("click", function () {
      window.location.href = "../SignUpPage/SignUpPage.html";
    });
  }
});
