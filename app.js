const squares = Array.from(document.querySelectorAll(".square"));

const resetButton = document.querySelector(".reset-button");
const changeDifficultyButton = document.querySelector(".change-difficulty-button");

const difficultyLabel = document.querySelector(".difficulty");
const winsLabel = document.querySelector(".wins");
const tiesLabel = document.querySelector(".ties");
const aiLabel = document.querySelector(".ai");

const board = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";
let isAiActive = false;
let activeCheatingEvents = 0;
const maxCheatingEvents = 1;
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
  activeCheatingEvents = 0;
  isAiActive = false;
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
  reset();
}

resetButton.addEventListener("click", () => {
  reset();
});

changeDifficultyButton.addEventListener("click", () => {
  if (aiDifficulty == "Easy") {
    aiDifficulty = "Impossible";
  } else if (aiDifficulty == "Impossible") {
    aiDifficulty = "Cheating";
  } else if (aiDifficulty == "Cheating") {
    aiDifficulty = "Easy";
  }
  humanWins = 0;
  aiWins = 0;
  ties = 0;
  winsLabel.textContent = "Human Wins: " + humanWins;
  tiesLabel.textContent = "Ties: " + ties;
  aiLabel.textContent = "AI Wins: " + aiWins;
  difficultyLabel.textContent = "Difficulty: " + aiDifficulty;
  reset();
});

function humanTurn(index) {
  if (!isAiActive && board[index] !== "") {
    return;
  }
  isAiActive = true
  activeCheatingEvents = 0;
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
      } else if (aiDifficulty == "Cheating") {
        aiTurnCheating();
      }
    }
  }, 50);
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
  }, 50);
  isAiActive = false;
}

function aiTurnImpossible() {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = aiPlayer;
      let score = minimaxImpossible(board, 0, false);
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
  }, 50);
  isAiActive = false;
}

function aiTurnCheating() {
  activeCheatingEvents++;
  if (activeCheatingEvents > maxCheatingEvents + 1) {
    return;
  }
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = aiPlayer;
      let score = minimaxImpossible(board, 0, false);
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
  if (Math.random() < 0.95) {
    if (Math.random() < 0.2) {
      aiTurnCheating();
    }
  } else {
    for (let i = 0; i < board.length; i++) {
      if (board[i] = humanPlayer) {
        board[i] = aiPlayer;
        squares[i].textContent = aiPlayer;
        squares[i].classList.add(aiPlayer);
      }
    }
  }
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
  }, 50);
  isAiActive = false;
  activeCheatingEvents--;
}

function minimaxImpossible(board, depth, isMaximizingPlayer) { // Calculates all possible moves to win and lose
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
        let score = minimaxImpossible(board, depth + 1, false);
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
        let score = minimaxImpossible(board, depth + 1, true);
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