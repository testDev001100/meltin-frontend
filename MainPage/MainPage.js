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

window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const userInfoElement = document.querySelector("user-info");

  if (!token) {
    userInfoElement.textContent = "로그인";
    userInfoElement.href = "/LogInPage.html"; // 로그인 페이지 경로 맞게 수정
    return;
  }

  try {
    const response = await fetch("http://10.109.3.88:8080/api/users/me", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    if (response.ok) {
      const user = await response.json();
      userInfoElement.textContent = `${user.name}님`;
      userInfoElement.href = "/MyPage.html"; // 예: 마이페이지로 이동하게
    } else {
      userInfoElement.textContent = "로그인";
      userInfoElement.href = "/LogInPage.html";
    }
  } catch (error) {
    console.error("유저 정보 불러오기 오류:", error);
    userInfoElement.textContent = "로그인";
    userInfoElement.href = "/LogInPage.html";
  }
});

let isLoggedIn = true; // 실제론 세션이나 로컬스토리지 기반으로 설정

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const userArea = document.getElementById("userArea");
  const usernameSpan = document.getElementById("username");
  const logoutBtn = document.getElementById("logoutBtn");

  const username = "홍길동"; // 실제 로그인 유저 이름으로 대체

  function updateAuthUI() {
    if (isLoggedIn) {
      loginBtn.style.display = "none";
      userArea.style.display = "flex";
      usernameSpan.textContent = username;
    } else {
      loginBtn.style.display = "block";
      userArea.style.display = "none";
    }
  }

  // 로그아웃 버튼 클릭 시
  logoutBtn.addEventListener("click", () => {
    isLoggedIn = false; // 또는 세션/토큰 제거
    updateAuthUI();
  });

  updateAuthUI();
});
