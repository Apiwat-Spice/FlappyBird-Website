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

        // ท่อบน
        ctx.fillStyle = "#2ecc71";

        ctx.fillRect(
            this.x,
            0,
            this.width,
            this.topHeight
        );

        // หัวท่อบน
        ctx.fillStyle = "#27ae60";

        ctx.fillRect(
            this.x - 5,
            this.topHeight - 20,
            this.width + 10,
            20
        );

        // ท่อล่าง
        ctx.fillStyle = "#2ecc71";

        ctx.fillRect(
            this.x,
            this.topHeight + this.gap,
            this.width,
            600
        );

        // หัวท่อล่าง
        ctx.fillStyle = "#27ae60";

        ctx.fillRect(
            this.x - 5,
            this.topHeight + this.gap,
            this.width + 10,
            20
        );
    }
}