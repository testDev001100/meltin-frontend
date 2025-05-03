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

  if (!response.ok) {
    let errorMessage = "비밀번호 변경에 실패했습니다.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.error("JSON 파싱 오류:", e);
    }
    throw new Error(errorMessage);
  }

  alert("비밀번호가 성공적으로 변경되었습니다.");
  window.location.href = "../MyPage/MyPage.html";
} catch (error) {
  errorMessage.textContent = error.message;
  console.error("비밀번호 변경 오류:", error);
}
