document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "../LoginPage/LoginPage.html";
    return;
  }

  try {
    const response = await fetch("http://10.109.3.88:8080/api/users/info", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("유저 정보 가져오기 실패:", errorText);
      alert("사용자 정보를 불러오는 데 실패했습니다.");
      return;
    }

    const data = await response.json();

    // DOM 업데이트
    document.getElementById("user-id").textContent = data.id;
    document.getElementById("user-name").textContent = data.name;
    document.getElementById("user-studentId").textContent = data.studentId;
    document.getElementById("user-team").textContent = data.team;
  } catch (error) {
    console.error("에러 발생:", error);
    alert("사용자 정보를 가져오는 중 오류가 발생했습니다.");
  }

  // 버튼 기능
  document
    .getElementById("change-password")
    .addEventListener("click", function () {
      window.location.href = "../ChangePasswordPage/ChangePasswordPage.html";
    });

  document.getElementById("withdraw").addEventListener("click", function () {
    window.location.href = "../WithdrawPage/WithdrawPage.html";
  });
});
