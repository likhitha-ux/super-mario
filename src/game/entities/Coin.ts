export class Coin {
    public x: number;
    public y: number;
    public width: number = 20;
    public height: number = 20;
    public animationFrame: number = 0;
    public animationTimer: number = 0;
    public collected: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public update(deltaTime: number): void {
        if (this.collected) return;

        this.animationTimer += deltaTime;
        
        if (this.animationTimer > 100) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }

        // Add a subtle floating animation
        this.y += Math.sin(Date.now() * 0.005) * 0.5;
    }
}