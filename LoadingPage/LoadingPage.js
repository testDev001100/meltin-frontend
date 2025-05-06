setInterval(async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://192.168.123.100:8080/api/matching/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

    const data = await res.json();
    console.log("매칭 결과 확인:", data);

    // ✅ 팀 번호가 존재하면 매칭 완료 처리
    if (data.teamNumber !== null && data.teamNumber !== undefined) {
      const loadingText = document.getElementById("loading-text");
      const dotContainer = document.querySelector(".dot-container");
      const resultContainer = document.getElementById("result-container");

      if (loadingText) loadingText.classList.add("hidden");
      if (dotContainer) dotContainer.classList.add("hidden");

      if (resultContainer) {
        resultContainer.classList.remove("hidden");
      }
    }
  } catch (err) {
    console.error("매칭 상태 확인 실패:", err);
  }
}, 3000);

function goToResult() {
  window.location.href = "../TeamResultPage/TeamResultPage.html";
}
