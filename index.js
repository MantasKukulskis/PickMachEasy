const board = document.getElementById("game-board");
const startBtn = document.getElementById("startBtn");
const difficultySelect = document.getElementById("difficulty");
const statusEl = document.getElementById("status");

const emojis = ["🐶", "🍕", "🚗", "🌈", "🐱", "🍎", "🎵", "⚽"];
let cards = [];
let flippedCards = [];
let matched = 0;
let mode = "easy";
let timer;
let timeLeft = 60;
let flipLimit = 30;
let currentFlips = 30;

startBtn.addEventListener("click", startGame);

function startGame() {
  board.innerHTML = "";
  statusEl.textContent = "";
  matched = 0;
  currentFlips = 0;
  mode = difficultySelect.value;
  flippedCards = [];

  const fullset = [...emojis, ...emojis];
  const shuffled = fullset.sort(() => Math.random() - 0.5);

  shuffled.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.textContent = "";
    card.addEventListener("click", handleFlip);
    board.appendChild(card);
  });

  if (mode === "normal") {
    timeLeft = 60;
    updateStatus(`Time: ${timeLeft}`);
    timer = setInterval(() => {
      timeLeft--;
      updateStatus(`Time: ${timeLeft}`);
      if (timeLeft <= 0) {
        clearInterval(timer);
        endGame("Times up");
      }
    }, 1000);
  } else if (mode === "hard") {
    flipLimit = 30;
    updateStatus(`Flips left ${flipLimit}`);
  }
}

function handleFlip(e) {
  const card = e.currentTarget;

  if (
    card.classList.contains("flipped") ||
    card.classList.contains("matched") ||
    flippedCards >= 2
  ) {
    return;
  }

  card.classList.add("flipped");
  card.textContent = card.dataset.emoji;
  flippedCards.push(card);

  if (mode === "hard") {
    currentFlips++;
    updateStatus(`flips left: ${flipLimit - currentFlips}`);
    if (currentFlips >= flipLimit) {
      endGame(`out of flips`);
      return;
    }
  }

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;
    if (first.dataset.emoji === second.dataset.emoji) {
      first.classList.add("matched");
      second.classList.add("matched");
      flippedCards = [];
      matched++;
      if (matched === emojis.length) {
        clearInterval(timer);
        setTimeout(() => endGame("You won!!!"), 300);
      }
    } else {
      setTimeout(() => {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        first.textContent = "";
        second.textContent = "";
        flippedCards = [];
      }, 800);
    }
  }
}

function endGame(message) {
  document
    .querySelectorAll(".card")
    .forEach((card) => card.removeEventListener("click", handleFlip));
  statusEl.textContent = message;
}

function updateStatus(text) {
  statusEl.textContent = text;
}