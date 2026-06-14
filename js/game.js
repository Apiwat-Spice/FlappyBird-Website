const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const jumpSound =
    new Audio("sounds/jump.wav");
const hitSound =
    new Audio("sounds/hit.wav");
const background = new Image();
background.src = "assets/background.png";

canvas.width = 400;
canvas.height = 600;
const jumpBtn =
    document.getElementById("jumpBtn");

const restartBtn =
    document.getElementById("restartBtn");
restartBtn.style.display = "none";

const bird = new Bird();

let pipes = [];

let frame = 0;
let score = 0;

let gameState = "PLAYING";

let highScore =
    Number(localStorage.getItem("highScore")) || 0;

jumpBtn.addEventListener(
    "click",
    () => {

        if (gameState === "PLAYING") {
            bird.jump();
            jumpSound.currentTime = 0;
            jumpSound.play();
        }
    }
);

restartBtn.addEventListener(
    "click",
    () => {
        location.reload();
    }
);

// =======================
// Input
// =======================

document.addEventListener("keydown", (e) => {

    if (
        gameState === "PLAYING" &&
        e.code === "Space"
    ) {
        bird.jump();
        jumpSound.currentTime = 0;
        jumpSound.play();
    }

    if (
        gameState === "GAMEOVER" &&
        e.code === "KeyR"
    ) {
        location.reload();
    }
});

// =======================
// Pipe
// =======================

function createPipe() {

    pipes.push(
        new Pipe(canvas.width)
    );
}

// =======================
// Game Over
// =======================

function gameOver() {

    if (gameState === "GAMEOVER") {
        return;
    }
    hitSound.currentTime = 0;
    hitSound.play();
    gameState = "GAMEOVER";

    restartBtn.style.display =
        "block";

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "highScore",
            highScore
        );
    }
}
// =======================
// Collision
// =======================

function checkCollision() {

    for (let pipe of pipes) {

        const hitTop =
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.topHeight;

        const hitBottom =
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y + bird.height >
            pipe.topHeight + pipe.gap;

        if (hitTop || hitBottom) {
            gameOver();
        }
    }

    if (
        bird.y < 0 ||
        bird.y + bird.height > canvas.height
    ) {
        gameOver();
    }
}

// =======================
// Update
// =======================

function update() {

    bird.update();

    frame++;

    if (frame % 120 === 0) {
        createPipe();
    }

    pipes.forEach(pipe => {

        pipe.update();

        if (
            !pipe.passed &&
            pipe.x + pipe.width < bird.x
        ) {
            pipe.passed = true;
            score++;
        }
    });

    pipes = pipes.filter(
        pipe => pipe.x + pipe.width > 0
    );

    checkCollision();
}

// =======================
// Draw
// =======================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    ctx.drawImage(
        background,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // bird
    bird.draw(ctx);

    // pipes
    pipes.forEach(pipe => {
        pipe.draw(ctx);
    });

    // score
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(
        `Score: ${score}`,
        10,
        40
    );

    // high score
    ctx.font = "20px Arial";
    ctx.fillText(
        `High: ${highScore}`,
        10,
        70
    );

    // game over screen
    if (gameState === "GAMEOVER") {

        ctx.fillStyle = "red";
        ctx.font = "40px Arial";

        ctx.fillText(
            "GAME OVER",
            70,
            250
        );

        ctx.font = "20px Arial";

        ctx.fillText(
            "Press R to Restart",
            105,
            300
        );
    }
}

// =======================
// Loop
// =======================

function gameLoop() {

    if (
        gameState === "PLAYING"
    ) {
        update();
    }

    draw();

    requestAnimationFrame(
        gameLoop
    );
}

gameLoop();