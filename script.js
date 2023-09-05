const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const levelSelect = document.getElementById("level");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Configuración inicial del nivel y velocidad
let selectedLevel = "easy"; // Nivel inicial: Fácil
let gameSpeed = 60; // Velocidad correspondiente al nivel Fácil

// Agregar los elementos de audio
const foodSound = new Audio("./Audio/eat.mp3");
const gameOverSound = new Audio("./Audio/dead 2.mp3");

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    const username = prompt("¡Se acabó el juego! Ingresa tu nombre :");

    if (username) {
        const user = {
            username,
            score
        };
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(user);
        users.sort((a, b) => b.score - a.score);
        localStorage.setItem('users', JSON.stringify(users));
        alert("Gracias por jugar. Tu puntaje ha sido registrado.");
        location.reload();
    } else {
        location.reload();
    }
}

const showScoresButton = document.querySelector("button");
showScoresButton.addEventListener("click", () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length > 0) {
        const scores = users.map(user => `${user.username}: ${user.score}`).join("\n");
        alert("Puntajes de los usuarios:\n" + scores);
    } else {
        alert("No hay puntajes registrados.");
    }
});

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;

        localStorage.setItem("high-score", highScore);

        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;

        foodSound.play();
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
        gameOverSound.play();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
            gameOverSound.play();
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
let setIntervalId = setInterval(initGame, gameSpeed);
document.addEventListener("keyup", changeDirection);

function changeDirection(e) {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Actualizar la velocidad según el nivel seleccionado
levelSelect.addEventListener("change", () => {
    selectedLevel = levelSelect.value; // Actualizar el nivel seleccionado
    updateSpeed(); // Actualizar la velocidad
});

// Función para actualizar la velocidad según el nivel
function updateSpeed() {
    if (selectedLevel === "easy") {
        gameSpeed = 100; // Fácil
    } else if (selectedLevel === "medium") {
        gameSpeed = 80; // Intermedio
    } else if (selectedLevel === "hard") {
        gameSpeed = 60; // Difícil
    }

    clearInterval(setIntervalId); // Detener el intervalo actual
    setIntervalId = setInterval(initGame, gameSpeed); // Iniciar el intervalo con la nueva velocidad
}

// Luego, en el código donde se inicia el juego por primera vez (puede ser al cargar la página), llama a updateSpeed para asegurarte de que la velocidad inicial se configure correctamente.
updateSpeed();
