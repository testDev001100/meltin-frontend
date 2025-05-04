const questions = [
  "오늘 하루 어땠어?",
  "요즘 빠져있는 취미 있어?",
  "가장 좋아하는 음식은?",
  "최근에 웃었던 일은?",
  "여행 가고 싶은 곳은?",
  "어릴 때 꿈은 뭐였어?",
  "스트레스 받을 때 어떻게 풀어?",
  "요즘 듣는 노래는?",
  "가장 친한 친구는 어떤 사람이야?",
];

let shuffled = [...questions].sort(() => Math.random() - 0.5);
const board = document.getElementById("bingo-board");
const modal = document.getElementById("modal");
const modalQuestion = document.getElementById("modal-question");
const toast = document.getElementById("toast");
let clickedState = Array(9).fill(false);

let bingoCount = 0; // 빙고 개수를 추적
let checkedLines = Array(8).fill(false); // 각 줄이 이미 체크됐는지 추적

function renderBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("bingo-cell");
    cell.dataset.index = i;
    cell.textContent = "";
    cell.addEventListener("click", () => handleCellClick(i, cell));
    board.appendChild(cell);
  }
}

function handleCellClick(index, cell) {
  if (clickedState[index]) return;

  clickedState[index] = true;
  cell.classList.add("clicked");
  modalQuestion.textContent = shuffled[index];
  showModal();

  checkBingo();
}

function showModal() {
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function checkBingo() {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!checkedLines[i] && line.every((i) => clickedState[i])) {
      checkedLines[i] = true;
      bingoCount++;
      showToast("빙고!");

      if (bingoCount >= 2) {
        // 2개의 빙고가 완성되면 게임 종료 및 결과 페이지로 이동
        setTimeout(() => {
          window.location.href = "../ResultPage/ResultPage.html"; // 결과 페이지로 이동
        }, 1500); // 토스트 메시지가 잠깐 보여지고 이동
      }
      break; // 하나의 빙고가 완성되면 더 이상 다른 줄을 검사하지 않음
    }
  }
}

renderBoard();
