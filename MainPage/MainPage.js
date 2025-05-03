document.addEventListener("DOMContentLoaded", function () {
  const logo = document.querySelector(".logo");

  if (logo) {
    logo.addEventListener("click", function () {
      // 메인 페이지로 이동
      window.location.href = "MainPage.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const login = document.querySelector(".user-info");

  if (login) {
    logo.addEventListener("click", function () {
      window.location.href = "../LogInPage/LogInPage.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });

  // 스크롤 이벤트를 체크하여 scrolled 클래스 추가하기
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 햄버거 토글
  hamburger.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });
});

const faqCards = document.querySelectorAll(".faqCard");
faqCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("active");
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const loginBtn = document.getElementById("loginBtn");
  const userArea = document.getElementById("userArea");
  const usernameSpan = document.getElementById("username");
  const logoutBtn = document.getElementById("logoutBtn");

  const token = localStorage.getItem("token");

  // 기본적으로 로그인 상태로 판단하지 않음
  let isLoggedIn = false;

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

        usernameSpan.addEventListener("click", () => {
          window.location.href = "../MyPage/MyPage.html";
        });
      } else {
        // 유효하지 않은 토큰
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

  updateAuthUI();
});
