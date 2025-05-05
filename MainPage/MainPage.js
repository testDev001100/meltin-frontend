document.addEventListener("DOMContentLoaded", async () => {
  const logo = document.querySelector(".logo");
  const loginBtn = document.getElementById("loginBtn");
  const userArea = document.getElementById("userArea");
  const usernameSpan = document.getElementById("username");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminBtn = document.getElementById("adminBtn"); // 관리자 버튼
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  const token = localStorage.getItem("token");

  // 기본적으로 로그인 상태로 판단하지 않음
  let isLoggedIn = false;

  // logo 클릭 시 메인 페이지로 이동
  if (logo) {
    logo.addEventListener("click", function () {
      window.location.href = "MainPage.html";
    });
  }

  // login 버튼 클릭 시 로그인 페이지로 이동
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      window.location.href = "../LogInPage/LogInPage.html";
    });
  }

  // 관리자 권한 확인
  if (token) {
    try {
      const response = await fetch("http://192.168.123.100:8080/api/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        isLoggedIn = true;
        usernameSpan.textContent = `${user.name}님`;

        // 관리자 권한 체크
        if (user.role === "admin") {
          adminBtn.style.display = "inline-block";

          // 관리자 페이지로 이동하는 기능
          adminBtn.addEventListener("click", function () {
            window.location.href = "../AdminDashboard/AdminDashboard.html"; // 관리자 페이지로 리디렉션
          });
        } else {
          adminBtn.style.display = "none";
        }

        // 마이 페이지로 이동
        usernameSpan.addEventListener("click", () => {
          window.location.href = "../MyPage/MyPage.html";
        });
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("유저 정보 요청 실패:", error);
      localStorage.removeItem("token");
    }
  }

  // UI 업데이트
  function updateAuthUI() {
    if (isLoggedIn) {
      loginBtn.style.display = "none";
      userArea.style.display = "flex";
    } else {
      loginBtn.style.display = "block";
      userArea.style.display = "none";
    }
  }

  // 로그아웃 처리
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    isLoggedIn = false;
    updateAuthUI();
  });

  // 네비게이션 바
  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });

  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 햄버거 메뉴 토글
  hamburger.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // FAQ 카드 클릭 시 활성화
  const faqCards = document.querySelectorAll(".faqCard");
  faqCards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("active");
    });
  });

  updateAuthUI();
});
