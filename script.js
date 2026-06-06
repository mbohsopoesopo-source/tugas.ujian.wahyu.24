// ==========================================
// GLOBALS & SYSTEM TABS NAVIGATION
// ==========================================
const panels = document.querySelectorAll('.game-panel');
const tabs = document.querySelectorAll('.game-tab');

function switchGame(index) {
    tabs.forEach(tab => tab.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));

    tabs[index].classList.add('active');
    panels[index].classList.add('active');

    if (index !== 1) {
        stopSnakeGame();
    }

    if (index === 2) initMemoryGame();
    if (index === 3) initTypingGame();
}

// Hamburger Menu Toggle
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');

if (navToggle) {
    navToggle.addEventListener('click', () => mobileNav.classList.add('open'));
}
if (mobileNavClose) {
    mobileNavClose.addEventListener('click', () => mobileNav.classList.remove('open'));
}

function toggleMobileMenu() {
    mobileNav.classList.remove('open');
}


// ==========================================
// 1. GAME KUIS
// ==========================================
const quizQuestions = [
    { q: "Apa kepanjangan dari HTML?", o: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tabular Multi Language"], a: 0, f: "Benar! HTML adalah bahasa markup standar untuk membuat halaman web." },
    { q: "Properti CSS mana yang digunakan untuk merubah warna teks?", o: ["font-color", "text-color", "color"], a: 2, f: "Tepat! Properti 'color' digunakan khusus untuk mengatur warna teks primer." }
];
let currentQuizIdx = 0;
let quizScore = 0;

function loadQuizQuestion() {
    const qData = quizQuestions[currentQuizIdx];
    const qLabel = document.getElementById("quizQuestion");
    if (!qLabel) return;
    qLabel.innerText = qData.q;
    const optionsContainer = document.getElementById("quizOptions");
    optionsContainer.innerHTML = "";
    document.getElementById("quizFeedback").classList.remove("show");
    document.getElementById("quizNextBtn").style.display = "none";

    const progress = ((currentQuizIdx) / quizQuestions.length) * 100;
    document.getElementById("quizBar").style.width = `${progress}%`;

    qData.o.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.innerText = opt;
        btn.onclick = () => checkQuizAnswer(idx, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkQuizAnswer(selectedIdx, clickedBtn) {
    const qData = quizQuestions[currentQuizIdx];
    const allButtons = document.querySelectorAll(".quiz-option");
    allButtons.forEach(b => b.disabled = true);

    if (selectedIdx === qData.a) {
        clickedBtn.classList.add("correct");
        quizScore += 50;
        document.getElementById("quizScore").innerText = quizScore;
    } else {
        clickedBtn.classList.add("wrong");
        allButtons[qData.a].classList.add("correct");
    }

    const feed = document.getElementById("quizFeedback");
    feed.innerText = qData.f;
    feed.classList.add("show");
    document.getElementById("quizNextBtn").style.display = "inline-flex";
}

function nextQuestion() {
    currentQuizIdx++;
    if (currentQuizIdx < quizQuestions.length) {
        loadQuizQuestion();
    } else {
        document.getElementById("quizBox").style.display = "none";
        document.getElementById("quizResult").style.display = "block";
        document.getElementById("quizBar").style.width = "100%";
        document.getElementById("quizFinalScore").innerText = quizScore;
        document.getElementById("quizResultMsg").innerText = quizScore >= 100 ? "Luar biasa! Kamu menguasai materi dasar dengan sempurna." : "Coba lagi untuk mengasah kemampuan kodingmu!";
    }
}

function restartQuiz() {
    currentQuizIdx = 0;
    quizScore = 0;
    document.getElementById("quizScore").innerText = "0";
    document.getElementById("quizBox").style.display = "block";
    document.getElementById("quizResult").style.display = "none";
    loadQuizQuestion();
}
loadQuizQuestion();


// ==========================================
// 2. GAME ULAR (SNAKE)
// ==========================================
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("snakeScore");
const statusDisplay = document.getElementById("snakeStatus");

const boxSize = 20;
let snake = [{ x: 10 * boxSize, y: 10 * boxSize }];
let food = { x: 5 * boxSize, y: 5 * boxSize };
let snakeScore = 0;
let d = "RIGHT";
let snakeInterval = null;
let isGameRunning = false;

function generateSnakeFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
    };
}

function changeSnakeDirection(direction) {
    if (!isGameRunning) return;
    if (direction === "LEFT" && d !== "RIGHT") d = "LEFT";
    if (direction === "UP" && d !== "DOWN") d = "UP";
    if (direction === "RIGHT" && d !== "LEFT") d = "RIGHT";
    if (direction === "DOWN" && d !== "UP") d = "DOWN";
}

document.getElementById("btnPlay").addEventListener("click", startSnakeGame);
document.getElementById("btnStop").addEventListener("click", stopSnakeGame);
document.getElementById("btnReset").addEventListener("click", resetSnakeGame);

document.getElementById("btnUp").addEventListener("click", () => changeSnakeDirection("UP"));
document.getElementById("btnLeft").addEventListener("click", () => changeSnakeDirection("LEFT"));
document.getElementById("btnRight").addEventListener("click", () => changeSnakeDirection("RIGHT"));
document.getElementById("btnDown").addEventListener("click", () => changeSnakeDirection("DOWN"));

document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowLeft") changeSnakeDirection("LEFT");
    else if (e.key === "ArrowUp") changeSnakeDirection("UP");
    else if (e.key === "ArrowRight") changeSnakeDirection("RIGHT");
    else if (e.key === "ArrowDown") changeSnakeDirection("DOWN");
});

function drawSnakeGame() {
    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#e8c76a" : "#1a1a1a";
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
        ctx.strokeStyle = "#2a2520";
        ctx.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }

    ctx.fillStyle = "#c9a84c";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === "LEFT") snakeX -= boxSize;
    if (d === "UP") snakeY -= boxSize;
    if (d === "RIGHT") snakeX += boxSize;
    if (d === "DOWN") snakeY += boxSize;

    if (snakeX === food.x && snakeY === food.y) {
        snakeScore++;
        scoreDisplay.innerText = snakeScore;
        generateSnakeFood();
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || (function() {
            for (let i = 0; i < snake.length; i++) { if (newHead.x === snake[i].x && newHead.y === snake[i].y) return true; }
            return false;
        })()) {
        stopSnakeGame();
        alert("Game Over! Skor Akhir Anda: " + snakeScore);
        resetSnakeGame();
        return;
    }
    snake.unshift(newHead);
}

function startSnakeGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        statusDisplay.innerText = "Berjalan";
        statusDisplay.style.color = "var(--green)";
        snakeInterval = setInterval(drawSnakeGame, 130);
    }
}

function stopSnakeGame() {
    if (isGameRunning) {
        isGameRunning = false;
        statusDisplay.innerText = "Berhenti";
        statusDisplay.style.color = "var(--accent)";
        clearInterval(snakeInterval);
    }
}

function resetSnakeGame() {
    stopSnakeGame();
    snake = [{ x: 10 * boxSize, y: 10 * boxSize }];
    d = "RIGHT";
    snakeScore = 0;
    scoreDisplay.innerText = "0";
    generateSnakeFood();

    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e8c76a";
    ctx.fillRect(snake[0].x, snake[0].y, boxSize, boxSize);
    ctx.fillStyle = "#c9a84c";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
}
resetSnakeGame();


// ==========================================
// 3. MEMORY GAME
// ==========================================
const cardIcons = ['💎', '🔑', '🔮', '📜', '🔱', '🛡️', '👑', '🏺', '💎', '🔑', '🔮', '📜', '🔱', '🛡️', '👑', '🏺'];
let flippedCards = [];
let matchedCount = 0;
let memMoves = 0;

function initMemoryGame() {
    const board = document.getElementById("memoryBoard");
    if (!board) return;
    board.innerHTML = "";
    flippedCards = [];
    matchedCount = 0;
    memMoves = 0;
    document.getElementById("memMoves").innerText = "0";
    document.getElementById("memMatches").innerText = "0";

    const shuffled = cardIcons.sort(() => 0.5 - Math.random());
    shuffled.forEach((icon, idx) => {
        const card = document.createElement("div");
        card.className = "mem-card";
        card.dataset.icon = icon;
        card.innerHTML = `<div class="mem-back"></div><div class="mem-face">${icon}</div>`;
        card.onclick = () => flipMemoryCard(card);
        board.appendChild(card);
    });
}

function flipMemoryCard(card) {
    if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        memMoves++;
        document.getElementById("memMoves").innerText = memMoves;

        if (flippedCards[0].dataset.icon === flippedCards[1].dataset.icon) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
            matchedCount++;
            document.getElementById("memMatches").innerText = matchedCount;
            flippedCards = [];
            if (matchedCount === 8) setTimeout(() => alert("Hebat! Kamu menyelesaikan permainan Memory Card!"), 500);
        } else {
            setTimeout(() => {
                flippedCards[0].classList.remove('flipped');
                flippedCards[1].classList.remove('flipped');
                flippedCards = [];
            }, 800);
        }
    }
}


// ==========================================
// 4. TYPING GAME
// ==========================================
const typingSamples = [
    "Kreativitas tingkat tinggi bermula dari baris kode yang terstruktur dengan penuh dedikasi.",
    "Jangan takut mencoba hal baru karena teknologi berkembang dari sebuah eksperimen berani."
];
let sampleText = "";
let typingTimer = null;
let timeLeft = 60;
let isTypingStarted = false;

function initTypingGame() {
    clearInterval(typingTimer);
    isTypingStarted = false;
    timeLeft = 60;
    document.getElementById("typeTime").innerText = "60s";
    document.getElementById("typeWpm").innerText = "0";
    document.getElementById("typeAcuracy").innerText = "100%";

    const input = document.getElementById("typingInput");
    if (!input) return;
    input.value = "";
    input.disabled = false;

    sampleText = typingSamples[Math.floor(Math.random() * typingSamples.length)];
    const textContainer = document.getElementById("typingText");
    textContainer.innerHTML = "";

    sampleText.split("").forEach((char, idx) => {
        const span = document.createElement("span");
        span.className = "char" + (idx === 0 ? " cursor" : "");
        span.innerText = char;
        textContainer.appendChild(span);
    });
}

const typingInputElem = document.getElementById("typingInput");
if (typingInputElem) {
    typingInputElem.addEventListener("input", function() {
        if (!isTypingStarted) {
            isTypingStarted = true;
            typingTimer = setInterval(() => {
                timeLeft--;
                document.getElementById("typeTime").innerText = timeLeft + "s";
                if (timeLeft <= 0) {
                    clearInterval(typingTimer);
                    document.getElementById("typingInput").disabled = true;
                    alert("Waktu habis!");
                }
            }, 1000);
        }

        const val = this.value;
        const spans = document.querySelectorAll("#typingText .char");
        let correctCount = 0;

        spans.forEach((span, idx) => {
            span.classList.remove("done", "wrong", "cursor");
            if (idx === val.length) span.classList.add("cursor");

            if (idx < val.length) {
                if (val[idx] === sampleText[idx]) {
                    span.classList.add("done");
                    correctCount++;
                } else {
                    span.classList.add("wrong");
                }
            }
        });

        if (val.length > 0) {
            const accuracy = Math.round((correctCount / val.length) * 100);
            document.getElementById("typeAcuracy").innerText = accuracy + "%";
            const wpm = Math.round((val.length / 5) / ((60 - timeLeft) / 60 || 1));
            document.getElementById("typeWpm").innerText = wpm;
        }
    });
}