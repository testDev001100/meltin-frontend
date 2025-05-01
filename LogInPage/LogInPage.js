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
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        alert("로그인 성공!");
        // 예: 토큰 저장하고 마이페이지로 이동
        // localStorage.setItem('token', result.token);
        // window.location.href = '/mypage.html';
      } else {
        alert("로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  });
