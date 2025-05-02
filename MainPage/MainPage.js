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

  if (logo) {
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
