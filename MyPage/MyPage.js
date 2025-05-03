document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "../LoginPage/LoginPage.html";
    return;
  }

  try {
    const response = await fetch("http://10.109.3.88:8080/api/users/mypage", {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("유저 정보 요청 실패");
    }

    const user = await response.json();

    // 사용자 정보 반영
    document.getElementById("userid").textContent = user.userid || "N/A";
    document.getElementById("username").textContent = user.username || "N/A";
    document.getElementById("studentId").textContent = user.studentId || "N/A";
    document.getElementById("teamName").textContent = user.teamName || "미배정";

    // ✅ 로그인 확인 완료 → 화면 표시
    document.body.style.display = "block";
  } catch (error) {
    console.error("에러:", error);
    alert("사용자 정보를 불러오지 못했습니다. 다시 로그인해주세요.");
    localStorage.removeItem("token");
    window.location.href = "../LoginPage/LoginPage.html";
  }
});
