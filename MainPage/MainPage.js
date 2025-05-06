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

  // 로고 클릭 → 메인 페이지 이동
  logo?.addEventListener("click", () => {
    window.location.href = "/MainPage/MainPage.html";
  });

  // 로그인 버튼 클릭
  loginBtn?.addEventListener("click", () => {
    window.location.href = "../LogInPage/LogInPage.html";
  });

  // 관리자 버튼 클릭 시 권한 확인 후 이동
  adminBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!token) {
      alert("로그인이 필요합니다.");
      window.location.href = "../LogInPage/LogInPage.html";
      return;
    }

    try {
      const response = await fetch("https://meltin.shop/api/admin/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const user = await response.json();
        if (user.role === "ROLE_ADMIN") {
          window.location.href = "../AdminDashboard/AdminDashboard.html";
        } else {
          alert("관리자만 접근할 수 있습니다.");
          // 일반 유저일 때는 토큰 삭제하지 않음!
        }
      } else if (response.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        window.location.href = "../LogInPage/LogInPage.html";
      } else {
        alert("관리자 권한이 없습니다.");
      }
    } catch (err) {
      console.error("❌ 관리자 확인 실패:", err);
      alert("서버 오류가 발생했습니다.");
    }
  });

  // 사용자 정보 불러오기
  if (token) {
    try {
      const response = await fetch("https://meltin.shop/api/users/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const user = await response.json();
        isLoggedIn = true;
        usernameSpan.textContent = `마이페이지`;
        usernameSpan.addEventListener("click", () => {
          window.location.href = "../MyPage/MyPage.html";
        });

        if (user.role === "ROLE_ADMIN") {
          adminBtn.style.display = "inline-block";
        }
      } else if (response.status === 401) {
        localStorage.removeItem("token");
      }
    } catch {
      localStorage.removeItem("token");
    }
  }

  // 로그아웃
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("token");
    isLoggedIn = false;
    updateAuthUI();
  });

  function updateAuthUI() {
    if (isLoggedIn) {
      loginBtn.style.display = "none";
      userArea.style.display = "flex";
    } else {
      loginBtn.style.display = "block";
      userArea.style.display = "none";
      adminBtn.style.display = "none";
    }
  }

  // 네비 링크 클릭 시 메뉴 닫기
  navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });

  // 스크롤 시 네비바 스타일 변경
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    navbar?.classList.toggle("scrolled", window.scrollY > 50);
  });

  // 햄버거 토글
  hamburger?.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // FAQ 카드 클릭 시 토글
  document.querySelectorAll(".faqCard").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("active");
    });
  });

  updateAuthUI();
});

document.getElementById("scroll-btn").addEventListener("click", () => {
  document.getElementById("features").scrollIntoView({ behavior: "smooth" });
});
