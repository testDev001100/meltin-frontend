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
  const userInfoElement = document.getElementById("user-info");

  if (!token) {
    userInfoElement.textContent = "로그인";
    userInfoElement.href = "/LogInPage.html"; // 로그인 페이지 경로 맞게 수정
    return;
  }

  try {
    const response = await fetch("http://10.105.1.127:8080/api/users/me", {
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
