class Pipe {

    constructor(x) {

        this.x = x;

        this.width = 60;
        this.gap = 150;

        this.topHeight =
            Math.random() * 200 + 50;

        this.speed = 3;

        this.passed = false;
    }

    update() {
        this.x -= this.speed;
    }

    draw(ctx) {

        ctx.fillStyle = "green";

        ctx.fillRect(
            this.x,
            0,
            this.width,
            this.topHeight
        );

        ctx.fillRect(
            this.x,
            this.topHeight + this.gap,
            this.width,
            600
        );
    }
}