document
  .getElementById("signup-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const studentId = document.getElementById("studentId").value;
    const name = document.getElementById("name").value;

    const data = {
      username,
      password,
      studentId,
      name,
    };

    try {
      const response = await fetch("http://192.168.123.100:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      const messageElement = document.getElementById("result-message");

      if (response.ok) {
        messageElement.textContent = result.message || "회원가입 성공!";
        messageElement.style.color = "green";
      } else {
        messageElement.textContent = result.message || "회원가입 실패";
        messageElement.style.color = "red";
      }
    } catch (error) {
      console.error("에러 발생:", error);
      const messageElement = document.getElementById("result-message");
      messageElement.textContent = "서버 오류가 발생했습니다.";
      messageElement.style.color = "red";
    }
  });
