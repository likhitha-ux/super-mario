import { InputHandler } from '../InputHandler';
import { Platform } from './Platform';

export class Player {
    public x: number;
    public y: number;
    public width: number = 32;
    public height: number = 32;
    public velocityX: number = 0;
    public velocityY: number = 0;
    public speed: number = 200;
    public jumpPower: number = 600;
    public isJumping: boolean = false;
    public isGrounded: boolean = false;
    public direction: 'left' | 'right' = 'right';
    public animationFrame: number = 0;
    public animationTimer: number = 0;

    private readonly gravity: number = 1200;
    private readonly friction: number = 0.8;
    private readonly maxSpeed: number = 300;

    constructor(
        x: number,
        y: number,
        private inputHandler: InputHandler
    ) {
        this.x = x;
        this.y = y;
    }

    public update(deltaTime: number, platforms: Platform[]): void {
        const dt = deltaTime / 1000; // Convert to seconds

        this.handleInput(dt);
        this.applyPhysics(dt);
        this.handlePlatformCollisions(platforms);
        this.updateAnimation(deltaTime);
    }

    private handleInput(deltaTime: number): void {
        const keys = this.inputHandler.keys;

        // Horizontal movement
        if (keys.ArrowLeft) {
            this.velocityX = Math.max(this.velocityX - this.speed * deltaTime, -this.maxSpeed);
            this.direction = 'left';
        } else if (keys.ArrowRight) {
            this.velocityX = Math.min(this.velocityX + this.speed * deltaTime, this.maxSpeed);
            this.direction = 'right';
        } else {
            this.velocityX *= this.friction;
            if (Math.abs(this.velocityX) < 10) this.velocityX = 0;
        }

        // Jumping
        if (keys.Space && this.isGrounded && !this.isJumping) {
            this.velocityY = -this.jumpPower;
            this.isJumping = true;
            this.isGrounded = false;
        }
    }

    private applyPhysics(deltaTime: number): void {
        // Apply gravity
        this.velocityY += this.gravity * deltaTime;

        // Update position
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Keep player within screen bounds
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = 0;
        }
        // Remove right boundary to allow scrolling
    }

    private handlePlatformCollisions(platforms: Platform[]): void {
        this.isGrounded = false;

        platforms.forEach(platform => {
            if (this.checkCollisionWith(platform)) {
                // Top collision (landing on platform)
                if (this.velocityY > 0 && this.y < platform.y) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.isGrounded = true;
                    this.isJumping = false;
                }
                // Bottom collision (hitting platform from below)
                else if (this.velocityY < 0 && this.y > platform.y) {
                    this.y = platform.y + platform.height;
                    this.velocityY = 0;
                }
                // Side collisions
                else if (this.velocityX > 0 && this.x < platform.x) {
                    this.x = platform.x - this.width;
                    this.velocityX = 0;
                } else if (this.velocityX < 0 && this.x > platform.x) {
                    this.x = platform.x + platform.width;
                    this.velocityX = 0;
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
        
        if (this.animationTimer > 150) { // Animation frame duration
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }
    }

    public bounce(): void {
        this.velocityY = -200; // Small bounce when stomping enemies
    }

    public reset(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isGrounded = false;
        this.direction = 'right';
    }
}