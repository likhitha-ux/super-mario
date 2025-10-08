import { Platform } from './Platform';

export class Enemy {
    public x: number;
    public y: number;
    public width: number = 28;
    public height: number = 28;
    public velocityX: number;
    public velocityY: number = 0;
    public type: string;
    public direction: 'left' | 'right' = 'left';
    public animationFrame: number = 0;
    public animationTimer: number = 0;

    private readonly gravity: number = 1200;
    private readonly speed: number = 50;

    constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.velocityX = -this.speed;
    }

    public update(deltaTime: number, platforms: Platform[]): void {
        const dt = deltaTime / 1000;

        // Apply gravity
        this.velocityY += this.gravity * dt;

        // Update position
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;

        // Handle platform collisions
        this.handlePlatformCollisions(platforms);

        // Update animation
        this.updateAnimation(deltaTime);

        // Reverse direction at screen edges
        if (this.x <= 0 || this.x + this.width >= 3072) { // Extended world width
            this.velocityX *= -1;
            this.direction = this.direction === 'left' ? 'right' : 'left';
        }
    }

    private handlePlatformCollisions(platforms: Platform[]): void {
        platforms.forEach(platform => {
            if (this.checkCollisionWith(platform)) {
                // Landing on platform
                if (this.velocityY > 0 && this.y < platform.y) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                }
                // Hit platform edge, reverse direction
                else if ((this.velocityX > 0 && this.x < platform.x) || 
                        (this.velocityX < 0 && this.x > platform.x + platform.width)) {
                    this.velocityX *= -1;
                    this.direction = this.direction === 'left' ? 'right' : 'left';
                }
            }
        });
    }

    private checkCollisionWith(platform: Platform): boolean {
        return this.x < platform.x + platform.width &&
               this.x + this.width > platform.x &&
               this.y < platform.y + platform.height &&
               this.y + this.height > platform.y;
    }

    private updateAnimation(deltaTime: number): void {
        this.animationTimer += deltaTime;
        
        if (this.animationTimer > 200) {
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.animationTimer = 0;
        }
    }
}