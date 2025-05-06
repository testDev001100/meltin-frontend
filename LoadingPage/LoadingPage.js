setInterval(async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("/api/matching/me", {
      method: "GET",
      headers: {
         Authorization: `Bearer ${token}` 
      },
    });

    if (!res.ok) return;

    const data = await res.json();

    if (!data.message) {
      // 팀이 배정된 상태일 때
      const loadingText = document.getElementById("loading-text");
      const resultContainer = document.getElementById("result-container");

      // 기존 "매칭 중입니다" 텍스트를 "팀이 완성되었습니다!"로 바꾸고 숨기지 않음
      if (loadingText) {
        loadingText.textContent = "팀이 완성되었습니다!";
      }

      // 결과 컨테이너 보이기 (버튼 포함)
      if (resultContainer) {
        resultContainer.classList.remove("hidden");
      }
    }
  } catch (err) {
    console.error("매칭 상태 확인 실패:", err);
  }
}, 3000);

// 팀 확인 버튼 클릭 시 페이지 이동
function goToResult() {
  window.location.href = "/TeamResultPage/TeamResultPage.html";
}
