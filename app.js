const squares = Array.from(document.querySelectorAll(".square"));

const resetButton = document.querySelector(".reset-button");
const changeDifficultyButton = document.querySelector(".change-difficulty-button");

const difficultyLabel = document.querySelector(".difficulty");
const winsLabel = document.querySelector(".wins");
const tiesLabel = document.querySelector(".ties");
const aiLabel = document.querySelector(".ai");

const board = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";
const humanPlayer = "X";
const aiPlayer = "O";

var humanWins = 0;
var aiWins = 0;
var ties = 0;

var placedSound = new Audio('HumanPlacedMarkerSoundEffect.mp3');
var aiPlacedSound = new Audio('AIPlacedMarkerSoundEffect.mp3');
var failSound = new Audio('FailSoundEffect.mp3');
var winSound = new Audio('WinSoundEffect.mp3');

var aiDifficulty = "Easy";

function checkWin(player) {
  // check rows
  for (let i = 0; i <= 6; i += 3) {
    if (board[i] === player && board[i + 1] === player && board[i + 2] === player) {
      return true;
    }
  }
  // check columns
  for (let i = 0; i <= 2; i++) {
    if (board[i] === player && board[i + 3] === player && board[i + 6] === player) {
      return true;
    }
  }
  // check diagonals
  if (board[0] === player && board[4] === player && board[8] === player) {
    return true;
  }
  if (board[2] === player && board[4] === player && board[6] === player) {
    return true;
  }
  return false;
}

function checkDraw() {
  return board.every((square) => square !== "");
}

function reset() {
  board.fill("");
  squares.forEach((square) => {
    square.textContent = "";
    square.classList.remove(humanPlayer, aiPlayer);
  });
  currentPlayer = humanPlayer;
}

function gameResult(result) {
  if (result == "HumanWin") {
    winSound.currentTime = 0;
    winSound.play();
    humanWins++;
  } else if (result == "Tie") {
    ties++;
  }
  else if (result == "AiWin") {
    failSound.currentTime = 0;
    failSound.play();
    aiWins++;
  }
  winsLabel.textContent = "Human Wins: " + humanWins;
  tiesLabel.textContent = "Ties: " + ties;
  aiLabel.textContent = "AI Wins: " + aiWins;
}

resetButton.addEventListener("click", () => {
  reset();
});

changeDifficultyButton.addEventListener("click", () => {
  if (aiDifficulty == "Easy") {
    aiDifficulty = "Impossible";
  } else if (aiDifficulty == "Impossible") {
    aiDifficulty = "Easy";
  }
  difficultyLabel.textContent = "Difficulty: " + aiDifficulty;
  humanWins = 0;
  aiWins = 0;
  ties = 0;
  winsLabel.textContent = "Human Wins: " + humanWins;
  tiesLabel.textContent = "Ties: " + ties;
  aiLabel.textContent = "AI Wins: " + aiWins;
  reset();
});

function humanTurn(index) {
  if (board[index] !== "") {
    return;
  }
  placedSound.currentTime = 0;
  placedSound.play();
  board[index] = humanPlayer;
  squares[index].textContent = humanPlayer;
  squares[index].classList.add(humanPlayer);
  setTimeout(function(){
    if (checkWin(humanPlayer)) {
      gameResult("HumanWin");
      alert(`${humanPlayer} wins!`);
      reset();
    } else if (checkDraw()) {
      gameResult("Tie");
      alert("Draw!");
      reset();
    } else {
      currentPlayer = aiPlayer;
      if (aiDifficulty == "Easy"){
        aiTurnEasy();
      } else if (aiDifficulty == "Impossible") {
        aiTurnImpossible();
      }
    }
  }, 5000);
}

function aiTurnEasy() {
  let index = null;
  while (index === null) {
    const randomIndex = Math.floor(Math.random() * board.length);
    if (board[randomIndex] === "") {
      index = randomIndex;
    }
  }
  aiPlacedSound.currentTime = 0;
  aiPlacedSound.play();
  board[index] = aiPlayer;
  squares[index].textContent = aiPlayer;
  squares[index].classList.add(aiPlayer);
  setTimeout(function(){
    if (checkWin(aiPlayer)) {
      gameResult("AiWin");
      alert(`${aiPlayer} wins!`);
      reset();
    } else if (checkDraw()) {
      gameResult("Tie");
      alert("Draw!");
      reset();
    } else {
      currentPlayer = humanPlayer;
    }
  }, 100);
}

function aiTurnImpossible() {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = aiPlayer;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  aiPlacedSound.currentTime = 0;
  aiPlacedSound.play();
  board[bestMove] = aiPlayer;
  squares[bestMove].textContent = aiPlayer;
  squares[bestMove].classList.add(aiPlayer);
  setTimeout(function(){
    if (checkWin(aiPlayer)) {
      gameResult("AiWin");
      alert(`${aiPlayer} wins!`);
      reset();
    } else if (checkDraw()) {
      gameResult("Tie");
      alert("Draw!");
      reset();
    } else {
      currentPlayer = humanPlayer;
    }
  }, 100);
}

function minimax(board, depth, isMaximizingPlayer) {
  if (checkWin(humanPlayer)) {
    return -10 + depth;
  } else if (checkWin(aiPlayer)) {
    return 10 - depth;
  } else if (checkDraw()) {
    return 0;
  }

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = aiPlayer;
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = humanPlayer;
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

squares.forEach((square, index) => {
  square.addEventListener("click", () => {
    if (currentPlayer === humanPlayer) {
      humanTurn(index);
    }
  });
});

reset();
