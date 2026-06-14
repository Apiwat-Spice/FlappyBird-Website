/**
 * =====================================
 * Game Setup
 * =====================================
 * ส่วนเตรียม Canvas, รูปภาพ, เสียง
 * และตัวแปรหลักของเกม
 */

// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Sound Effects
const jumpSound = new Audio("sounds/jump.wav");
const hitSound = new Audio("sounds/hit.wav");

// Background Image
const background = new Image();
background.src = "assets/background.png";

// Canvas Size
canvas.width = 400;
canvas.height = 600;

// =====================================
// UI Elements
// =====================================

// ปุ่มกระโดด (สำหรับมือถือ)
const jumpBtn =
    document.getElementById("jumpBtn");

// ปุ่มเริ่มเกมใหม่
const restartBtn =
    document.getElementById("restartBtn");

// ซ่อนปุ่ม Restart จนกว่าจะ Game Over
restartBtn.style.display = "none";

// =====================================
// Game Objects
// =====================================

// สร้างนก
const bird = new Bird();

// เก็บท่อทั้งหมดในเกม
let pipes = [];

// =====================================
// Game Variables
// =====================================

// ใช้นับเฟรมสำหรับสร้างท่อ
let frame = 0;

// คะแนนปัจจุบัน
let score = 0;

// สถานะเกม
// PLAYING | GAMEOVER
let gameState = "PLAYING";

// คะแนนสูงสุด (ดึงจาก Local Storage)
let highScore =
    Number(
        localStorage.getItem("highScore")
    ) || 0;

// =====================================
// Jump Button (Mobile)
// =====================================

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

// =====================================
// Restart Button
// =====================================

restartBtn.addEventListener(
    "click",
    () => {
        location.reload();
    }
);

// =====================================
// Keyboard Input
// =====================================

document.addEventListener(
    "keydown",
    (e) => {

        // กด Space เพื่อกระโดด
        if (
            gameState === "PLAYING" &&
            e.code === "Space"
        ) {

            bird.jump();

            jumpSound.currentTime = 0;
            jumpSound.play();
        }

        // กด R เพื่อเริ่มใหม่
        if (
            gameState === "GAMEOVER" &&
            e.code === "KeyR"
        ) {
            location.reload();
        }
    }
);

// =====================================
// Pipe System
// =====================================

/**
 * สร้างท่อใหม่ด้านขวาของจอ
 */
function createPipe() {

    pipes.push(
        new Pipe(canvas.width)
    );
}

// =====================================
// Game Over
// =====================================

/**
 * จบเกม
 *
 * - เล่นเสียงชน
 * - เปลี่ยนสถานะเกม
 * - แสดงปุ่ม Restart
 * - บันทึก High Score
 */
function gameOver() {

    // ป้องกันเรียกซ้ำหลายครั้ง
    if (gameState === "GAMEOVER") {
        return;
    }

    hitSound.currentTime = 0;
    hitSound.play();

    gameState = "GAMEOVER";

    restartBtn.style.display =
        "block";

    // บันทึกคะแนนสูงสุด
    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "highScore",
            highScore
        );
    }
}

// =====================================
// Collision Detection
// =====================================

/**
 * ตรวจสอบการชน
 *
 * 1. ชนท่อด้านบน
 * 2. ชนท่อด้านล่าง
 * 3. ชนพื้น
 * 4. ชนขอบบน
 */
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

        if (
            hitTop ||
            hitBottom
        ) {
            gameOver();
        }
    }

    // ชนพื้นหรือออกขอบบน
    if (
        bird.y < 0 ||
        bird.y + bird.height >
        canvas.height
    ) {
        gameOver();
    }
}

// =====================================
// Update
// =====================================

/**
 * อัปเดตสถานะเกมทุกเฟรม
 *
 * - อัปเดตนก
 * - สร้างท่อ
 * - อัปเดตท่อ
 * - เพิ่มคะแนน
 * - ลบท่อที่พ้นจอ
 * - ตรวจสอบการชน
 */
function update() {

    // อัปเดตนก
    bird.update();

    // นับเฟรม
    frame++;

    // สร้างท่อทุก 120 เฟรม
    if (frame % 120 === 0) {
        createPipe();
    }

    // อัปเดตท่อทั้งหมด
    pipes.forEach(pipe => {

        pipe.update();

        // เพิ่มคะแนนเมื่อผ่านท่อ
        if (
            !pipe.passed &&
            pipe.x + pipe.width <
            bird.x
        ) {

            pipe.passed = true;
            score++;
        }
    });

    // ลบท่อที่ออกนอกจอ
    pipes = pipes.filter(
        pipe =>
            pipe.x + pipe.width > 0
    );

    // ตรวจสอบการชน
    checkCollision();
}

// =====================================
// Draw
// =====================================

/**
 * วาดทุกอย่างลง Canvas
 *
 * - พื้นหลัง
 * - นก
 * - ท่อ
 * - คะแนน
 * - High Score
 * - Game Over UI
 */
function draw() {

    // ล้างเฟรมเก่า
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // วาดพื้นหลัง
    ctx.drawImage(
        background,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // =====================
    // Bird
    // =====================

    bird.draw(ctx);

    // =====================
    // Pipes
    // =====================

    pipes.forEach(pipe => {
        pipe.draw(ctx);
    });

    // =====================
    // Score
    // =====================

    ctx.fillStyle = "black";

    ctx.font = "30px Arial";
    ctx.fillText(
        `Score: ${score}`,
        10,
        40
    );

    // =====================
    // High Score
    // =====================

    ctx.font = "20px Arial";

    ctx.fillText(
        `High: ${highScore}`,
        10,
        70
    );

    // =====================
    // Game Over Screen
    // =====================

    if (
        gameState === "GAMEOVER"
    ) {

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

// =====================================
// Game Loop
// =====================================

/**
 * ลูปหลักของเกม
 *
 * ทำงานประมาณ 60 ครั้ง/วินาที
 */
function gameLoop() {

    // อัปเดตเกมเฉพาะตอนเล่นอยู่
    if (
        gameState === "PLAYING"
    ) {
        update();
    }

    // วาดทุกเฟรม
    draw();

    requestAnimationFrame(
        gameLoop
    );
}

// =====================================
// Start Game
// =====================================

gameLoop();