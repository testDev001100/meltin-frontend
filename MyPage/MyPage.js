document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("title");
  const content = document.getElementById("content");
  const actions = document.getElementById("actions");

  // 백엔드 요청 (실제 API 경로로 교체)
  fetch("/경로명")
    .then((res) => {
      if (!res.ok) throw new Error("실패");
      return res.json();
    })
    .then((data) => {
      // 성공 시 마이페이지 출력
      title.textContent = "마이페이지";
      content.innerHTML = `
          <p><strong>아이디:</strong> ${data.id}</p>
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
    });
});
