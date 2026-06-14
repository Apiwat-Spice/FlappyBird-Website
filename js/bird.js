class Bird {

    constructor() {

        this.x = 100;
        this.y = 250;

        this.width = 40;
        this.height = 40;

        this.velocity = 0;
        this.gravity = 0.5;
        this.jumpForce = -8;
    }

    jump() {
        this.velocity = this.jumpForce;
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
    }

    draw(ctx) {
        ctx.fillStyle = "yellow";

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}