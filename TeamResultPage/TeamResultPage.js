document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const myStudentId = localStorage.getItem("studentId");

  try {
    const response = await fetch("https://meltin.shop/api/matching/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("팀 정보를 불러올 수 없습니다.");

    const teamData = await response.json(); // 전체 구조

    const { teamNumber, members } = teamData;

    const myInfo = members.find((member) => member.studentId === myStudentId);
    if (!myInfo) throw new Error("내 정보를 찾을 수 없습니다.");

    // HTML 요소에 값 삽입
    document.getElementById("team-number").textContent = teamNumber;
    document.getElementById("my-name").textContent = myInfo.name;
    document.getElementById("my-id").textContent = myInfo.studentId;

    const teamList = document.getElementById("team-members");
    members.forEach((member) => {
      const li = document.createElement("li");
      li.textContent = `${member.name} (${member.studentId})`;
      teamList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    alert("오류가 발생했습니다. 다시 시도해주세요.");
  }
});
