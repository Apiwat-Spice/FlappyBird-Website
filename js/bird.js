/**
 * =====================================
 * Bird Class
 * =====================================
 * จัดการตัวละครนก
 * - เก็บตำแหน่งของนก
 * - จัดการแรงโน้มถ่วง
 * - จัดการการกระโดด
 * - วาดนกลงบน Canvas
 */
class Bird {

    constructor() {

        // =====================
        // Position
        // =====================
        // ตำแหน่งเริ่มต้นของนก

        this.x = 100;
        this.y = 250;

        // =====================
        // Size
        // =====================
        // ขนาดของนก

        this.width = 40;
        this.height = 40;

        // =====================
        // Image
        // =====================
        // โหลดรูปนก

        this.image = new Image();
        this.image.src = "assets/bird.png";

        // =====================
        // Physics
        // =====================
        // velocity  = ความเร็วแนวดิ่ง
        // gravity   = แรงโน้มถ่วง
        // jumpForce = แรงกระโดด

        this.velocity = 0;
        this.gravity = 0.5;

        this.jumpForce = -8;
    }

    /**
     * ทำให้นกกระโดด
     * โดยกำหนดความเร็วเป็นค่ากระโดด
     */
    jump() {
        this.velocity = this.jumpForce;
    }

    /**
     * อัปเดตสถานะนกทุกเฟรม
     *
     * ขั้นตอน:
     * 1. เพิ่มแรงโน้มถ่วง
     * 2. นำความเร็วไปคำนวณตำแหน่งใหม่
     */
    update() {

        this.velocity += this.gravity;
        this.y += this.velocity;
    }

    /**
     * วาดนกลงบน Canvas
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {

        ctx.drawImage(
            this.image,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}