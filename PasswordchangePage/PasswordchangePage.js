try {
  const response = await fetch(
    "http://192.168.123.100:8080/api/users/password",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
    }
  );

  // 응답이 성공적이지 않으면 에러 처리
  if (!response.ok) {
    let errorMessage = "비밀번호 변경에 실패했습니다.";

    // JSON 응답이 있을 때만 처리
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.error("JSON 파싱 오류:", e);
      // JSON 파싱 실패 시에도 기본 오류 메시지를 사용
    }

    throw new Error(errorMessage);
  }

  // 비밀번호 변경 성공 후 페이지 이동
  alert("비밀번호가 성공적으로 변경되었습니다.");
  window.location.href = "../MyPage/MyPage.html";
} catch (error) {
  // 에러 메시지 출력
  errorMessage.textContent = error.message;
  console.error("비밀번호 변경 오류:", error);
}
