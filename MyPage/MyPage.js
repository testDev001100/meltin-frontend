document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "../LogInPage/LogInPage.html";
    return;
  }

  try {
    const response = await fetch("https://meltin.shop/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
  const PasswordchangeBtn = document.querySelector(".green-button");
  if (PasswordchangeBtn) {
    PasswordchangeBtn.addEventListener("click", function () {
      window.location.href = "../PasswordchangePage/PasswordchangePage.html";
    });
  }

  const deleteBtn = document.getElementById("delete-account-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async function () {
      if (!confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
        return;
      }

      try {
        const response = await fetch("https://meltin.shop/api/users/me", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let errMsg = "회원 탈퇴에 실패했습니다.";
          try {
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
              const data = await response.json();
              errMsg = data.message || errMsg;
            }
          } catch (e) {
            console.error("에러 파싱 실패:", e);
          }
          throw new Error(errMsg);
        }

        alert("회원 탈퇴가 완료되었습니다.");
        localStorage.removeItem("token");
        window.location.href = "../LogInPage/LogInPage.html";
      } catch (error) {
        console.error("회원 탈퇴 오류:", error);
        document.getElementById("delete-error-message").textContent =
          error.message;
      }
    });
  }
});
