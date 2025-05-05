setInterval(async () => {
  const res = await fetch("/api/matching/me");
  const data = await res.json();

  if (data.canSeeResult) {
    document.getElementById("confirm-btn").classList.remove("hidden");
  }
}, 3000);

// 팀 확인 버튼 클릭 시 페이지 이동
function goToResult() {
  window.location.href = "../TeamResultPage/TeamResultPage.html"; // 팀 결과 페이지
}
