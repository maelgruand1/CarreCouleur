const board = document.getElementById("game-board");
const statusDisplay = document.getElementById("status");
const twoPlayersBtn = document.getElementById("two-players");
const vsComputerBtn = document.getElementById("vs-computer");
const difficultySettings = document.getElementById("difficulty-settings");
const easyModeBtn = document.getElementById("easy-mode");
const hardModeBtn = document.getElementById("hard-mode");

let gameMode = "two-players"; // Par défaut : mode deux joueurs
let difficulty = "easy"; // Par défaut : IA facile
let currentPlayer = "red"; // Rouge commence
let boardState = Array(9).fill(null);
let isGameOver = false;

// Initialisation du jeu
function initGame() {
  board.innerHTML = "";
  board.classList.remove("hidden");
  statusDisplay.textContent = `Tour du joueur : ${
    currentPlayer === "red" ? "Rouge" : "Vert"
  }`;
  boardState = Array(9).fill(null);
  isGameOver = false;

  for (let i = 0; i < 9; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.dataset.index = i;
    square.addEventListener("click", handleMove);
    board.appendChild(square);
  }
}

// Gestion du clic sur une case
function handleMove(event) {
  if (isGameOver) return;
  const square = event.target;
  const index = square.dataset.index;

  if (boardState[index]) return; // Case déjà jouée

  boardState[index] = currentPlayer;
  square.classList.add(currentPlayer);

  if (checkWinCondition(currentPlayer)) {
    // Vérifie si le joueur actuel gagne
    statusDisplay.textContent = `Le joueur ${
      currentPlayer === "red" ? "Rouge" : "Vert"
    } gagne !`;
    isGameOver = true;
    return;
  }

  if (boardState.every((cell) => cell)) {
    statusDisplay.textContent = "Match nul !";
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "red" ? "green" : "red";
  statusDisplay.textContent = `Tour du joueur : ${
    currentPlayer === "red" ? "Rouge" : "Vert"
  }`;

  if (gameMode === "vs-computer" && currentPlayer === "green") {
    computerMove();
  }
}

// Coup de l'ordinateur avec difficulté
function computerMove() {
  let move;

  if (difficulty === "easy") {
    // Mode facile : choix aléatoire
    let emptySquares = boardState
      .map((cell, index) => (cell ? null : index))
      .filter((index) => index !== null);
    move = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  } else if (difficulty === "hard") {
    // Mode difficile : stratégie
    move = findBestMove();
  }

  document.querySelector(`[data-index="${move}"]`).click();
}

// Trouver le meilleur coup pour l'IA (Minimax simplifié)
function findBestMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < boardState.length; i++) {
    if (!boardState[i]) {
      boardState[i] = "green"; // L'IA joue son coup
      let score = minimax(boardState, 0, false);
      boardState[i] = null; // Annuler le coup
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

// Algorithme minimax
function minimax(board, depth, isMaximizing) {
  if (checkWinCondition("green")) return 10 - depth; // L'IA gagne
  if (checkWinCondition("red")) return depth - 10; // L'adversaire gagne
  if (board.every((cell) => cell)) return 0; // Match nul

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = "green"; // L'IA joue
        let score = minimax(board, depth + 1, false);
        board[i] = null; // Annuler le coup
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = "red"; // L'adversaire joue
        let score = minimax(board, depth + 1, true);
        board[i] = null; // Annuler le coup
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Vérification de la victoire pour un joueur donné
function checkWinCondition(player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Lignes
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Colonnes
    [0, 4, 8],
    [2, 4, 6], // Diagonales
  ];

  return winPatterns.some((pattern) =>
    pattern.every((index) => boardState[index] === player)
  );
}

// Gestion des boutons
twoPlayersBtn.addEventListener("click", () => {
  gameMode = "two-players";
  difficultySettings.classList.add("hidden");
  initGame();
});

vsComputerBtn.addEventListener("click", () => {
  gameMode = "vs-computer";
  difficultySettings.classList.remove("hidden");
  board.classList.add("hidden");
  statusDisplay.textContent = "";
});

easyModeBtn.addEventListener("click", () => {
  difficulty = "easy";
  difficultySettings.classList.add("hidden");
  initGame();
});

hardModeBtn.addEventListener("click", () => {
  difficulty = "hard";
  difficultySettings.classList.add("hidden");
  initGame();
});
