document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "../LogInPage/LogInPage.html";
    return;
  }

  try {
    const response = await fetch("http://192.168.123.100:8080/api/users/me", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("인증 실패");
    }

    const userData = await response.json();

    // DOM에 데이터 삽입 (필드명: username, name, studentId)
    document.getElementById("username").textContent = userData.username;
    document.getElementById("name").textContent = userData.name;
    document.getElementById("studentId").textContent = userData.studentId;
  } catch (error) {
    console.error("마이페이지 데이터 가져오기 실패:", error);
    alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
    localStorage.removeItem("token");
    window.location.href = "../LogInPage/LogInPage.html";
  }

  // ✅ 비밀번호 변경 버튼 클릭 시 이동
  const changePasswordBtn = document.querySelector(".green-button");
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", function () {
      window.location.href = "../ChangepasswordPage/ChangepasswordPage.html";
    });
  }
});