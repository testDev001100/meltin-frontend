document.addEventListener("DOMContentLoaded", async () => {
  const logo = document.querySelector(".logo");
  const loginBtn = document.getElementById("loginBtn");
  const userArea = document.getElementById("userArea");
  const usernameSpan = document.getElementById("username");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminBtn = document.getElementById("adminBtn");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  const token = localStorage.getItem("token");
  let isLoggedIn = false;

  // 로고 클릭 → 메인 페이지
  if (logo) {
    logo.addEventListener("click", () => {
      window.location.href = "MainPage.html";
    });
  }

  // 로그인 버튼 클릭
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "../LogInPage/LogInPage.html";
    });
  }

  // 사용자 정보 요청 및 UI 업데이트
  if (token) {
    try {
      const response = await fetch("http://192.168.123.100:8080/api/admin/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        isLoggedIn = true;

        // 사용자 이름 표시
        usernameSpan.textContent = `${user.name}님`;

        // 마이페이지 이동
        usernameSpan.addEventListener("click", () => {
          window.location.href = "../MyPage/MyPage.html";
        });

        // 관리자 권한일 경우 관리자 버튼 표시
        if (user.role === "ROLE_ADMIN") {
          adminBtn.style.display = "inline-block";
          adminBtn.addEventListener("click", () => {
            window.location.href = "../AdminDashboard/AdminDashboard.html";
          });
        } else {
          adminBtn.style.display = "none";
        }
      } else {
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("유저 정보 불러오기 실패:", err);
      localStorage.removeItem("token");
    }
  }

  // 로그아웃 기능
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      isLoggedIn = false;
      updateAuthUI();
    });
  }

  // 인증 UI 상태 업데이트 함수
  function updateAuthUI() {
    if (isLoggedIn) {
      loginBtn.style.display = "none";
      userArea.style.display = "flex";
    } else {
      loginBtn.style.display = "block";
      userArea.style.display = "none";
      adminBtn.style.display = "none"; // 로그아웃 후 관리자 버튼 숨김
    }
  }

  // 네비게이션 링크 클릭 시 메뉴 닫기
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });

  // 스크롤 시 네비바 스타일 변경
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  // 햄버거 메뉴 토글
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // FAQ 카드 클릭 시 활성화
  document.querySelectorAll(".faqCard").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("active");
    });
  });

  // 초기 UI 상태 적용
  updateAuthUI();
});
