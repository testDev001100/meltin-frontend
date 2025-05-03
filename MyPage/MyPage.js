document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

<<<<<<< HEAD
  // 백엔드 요청 (실제 API 경로로 교체)
  fetch("http://192.168.123.100:8080/api/users")
    .then((res) => {
      if (!res.ok) throw new Error("실패");
      return res.json();
    })
    .then((data) => {
      // 성공 시 마이페이지 출력
      title.textContent = "마이페이지";
      content.innerHTML = `
          <p><strong>아이디:</strong> ${data.username}</p>
          <p><strong>이름:</strong> ${data.name}</p>
          <p><strong>학번:</strong> ${data.studentId}</p>
        `;
      actions.innerHTML = `
          <a href="change-password.html" class="btn">비밀번호 변경</a>
          <a href="delete-user.html" class="btn danger">회원 탈퇴</a>
        `;
    })
    .catch((err) => {
      // 실패 시 오류 알림 UI 출력
      title.textContent = "마이페이지";
      content.textContent = "사용자 정보를 불러오는 데 실패했습니다.";
      actions.innerHTML = `
          <a href="change-password.html" class="btn">비밀번호 변경</a>
          <a href="delete-user.html" class="btn danger">회원 탈퇴</a>
        `;
=======
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
>>>>>>> a1de9c7830d1e0e4cf2e5b573e63d22764b2577f
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
