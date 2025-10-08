import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { Coin } from './entities/Coin';
import { Platform } from './entities/Platform';
import { InputHandler } from './InputHandler';
import { SoundManager } from './SoundManager';
import { GameRenderer } from './GameRenderer';
import { CollisionDetector } from './CollisionDetector';

export class Game {
    private player: Player;
    private enemies: Enemy[] = [];
    private coins: Coin[] = [];
    private platforms: Platform[] = [];
    private renderer: GameRenderer;
    private collisionDetector: CollisionDetector;
    
    public score: number = 0;
    public lives: number = 3;
    public level: number = 1;
    public gameState: 'playing' | 'gameOver' = 'playing';
    public onGameOver?: (score: number) => void;
    public cameraX: number = 0;

    constructor(
        private width: number,
        private height: number,
        private inputHandler: InputHandler,
        private soundManager: SoundManager
    ) {
        this.player = new Player(100, this.height - 100, this.inputHandler);
        this.renderer = new GameRenderer();
        this.collisionDetector = new CollisionDetector();
        
        this.initializeLevel();
    }

    private initializeLevel(): void {
        if (this.level === 1) {
            this.initializeLevel1();
        } else if (this.level === 2) {
            this.initializeLevel2();
        }
    }

    private initializeLevel1(): void {
        // Level 1 - Introduction level
        this.platforms = [
            new Platform(0, this.height - 32, this.width * 3, 32), // Extended ground
            new Platform(300, this.height - 128, 200, 32),
            new Platform(600, this.height - 200, 150, 32),
            new Platform(850, this.height - 150, 120, 32),
            new Platform(1200, this.height - 180, 180, 32),
            new Platform(1500, this.height - 120, 150, 32),
            new Platform(1800, this.height - 250, 200, 32),
        ];

        this.enemies = [
            new Enemy(400, this.height - 64, 'goomba'),
            new Enemy(700, this.height - 64, 'goomba'),
            new Enemy(900, this.height - 180, 'goomba'),
            new Enemy(1300, this.height - 64, 'goomba'),
            new Enemy(1600, this.height - 64, 'goomba'),
        ];

        this.coins = [
            new Coin(350, this.height - 180),
            new Coin(380, this.height - 180),
            new Coin(650, this.height - 250),
            new Coin(900, this.height - 200),
            new Coin(1250, this.height - 230),
            new Coin(1280, this.height - 230),
            new Coin(1550, this.height - 170),
            new Coin(1850, this.height - 300),
            new Coin(1880, this.height - 300),
        ];
    }

    private initializeLevel2(): void {
        // Level 2 - More challenging with gaps and higher platforms
        this.platforms = [
            new Platform(0, this.height - 32, 400, 32), // Starting ground
            new Platform(500, this.height - 32, 300, 32), // Ground with gap
            new Platform(900, this.height - 32, this.width * 2, 32), // Extended ground
            
            // Multi-level platforms
            new Platform(200, this.height - 120, 100, 32),
            new Platform(400, this.height - 180, 120, 32),
            new Platform(600, this.height - 240, 100, 32),
            new Platform(800, this.height - 200, 150, 32),
            new Platform(1100, this.height - 160, 100, 32),
            new Platform(1300, this.height - 220, 120, 32),
            new Platform(1500, this.height - 280, 100, 32),
            new Platform(1700, this.height - 180, 150, 32),
            new Platform(1950, this.height - 240, 100, 32),
            new Platform(2200, this.height - 160, 200, 32),
            
            // High platforms for advanced jumping
            new Platform(750, this.height - 320, 80, 32),
            new Platform(1450, this.height - 360, 80, 32),
            new Platform(2100, this.height - 340, 80, 32),
        ];

        this.enemies = [
            new Enemy(250, this.height - 64, 'goomba'),
            new Enemy(550, this.height - 64, 'goomba'),
            new Enemy(450, this.height - 210, 'goomba'),
            new Enemy(850, this.height - 230, 'goomba'),
            new Enemy(1150, this.height - 190, 'goomba'),
            new Enemy(1350, this.height - 250, 'goomba'),
            new Enemy(1750, this.height - 210, 'goomba'),
            new Enemy(2000, this.height - 270, 'goomba'),
            new Enemy(2250, this.height - 190, 'goomba'),
        ];

        this.coins = [
            // Ground level coins
            new Coin(150, this.height - 80),
            new Coin(180, this.height - 80),
            new Coin(650, this.height - 80),
            
            // Platform coins
            new Coin(230, this.height - 170),
            new Coin(430, this.height - 230),
            new Coin(630, this.height - 290),
            new Coin(830, this.height - 250),
            new Coin(1130, this.height - 210),
            new Coin(1330, this.height - 270),
            new Coin(1530, this.height - 330),
            new Coin(1730, this.height - 230),
            new Coin(1980, this.height - 290),
            new Coin(2230, this.height - 210),
            
            // High platform bonus coins
            new Coin(780, this.height - 370),
            new Coin(1480, this.height - 410),
            new Coin(2130, this.height - 390),
            
            // Coin trails for guidance
            new Coin(500, this.height - 100),
            new Coin(520, this.height - 120),
            new Coin(540, this.height - 140),
        ];
    }

    public update(deltaTime: number): void {
        if (this.gameState !== 'playing') return;

        // Update player
        this.player.update(deltaTime, this.platforms);

        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime, this.platforms);
        });

        // Update camera to follow player
        this.updateCamera();

        // Check collisions
        this.checkCollisions();

        // Update UI
        this.updateUI();

        // Check win/lose conditions
        this.checkGameState();
    }

    private checkCollisions(): void {
        // Player vs Enemies
        this.enemies.forEach((enemy, index) => {
            if (this.collisionDetector.checkCollision(this.player, enemy)) {
                if (this.player.isJumping && this.player.velocityY > 0) {
                    // Player jumped on enemy
                    this.enemies.splice(index, 1);
                    this.score += 100;
                    this.soundManager.playSound('stomp');
                    this.player.bounce();
                } else {
                    // Player hit enemy
                    this.playerHit();
                }
            }
        });

        // Player vs Coins
        this.coins.forEach((coin, index) => {
            if (this.collisionDetector.checkCollision(this.player, coin)) {
                this.coins.splice(index, 1);
                this.score += 50;
                this.soundManager.playSound('coin');
            }
        });

        // Check if player fell off screen
        if (this.player.y > this.height) {
            this.playerHit();
        }
    }

    private playerHit(): void {
        this.lives--;
        this.soundManager.playSound('hurt');
        
        if (this.lives <= 0) {
            this.gameState = 'gameOver';
            this.onGameOver?.(this.score);
        } else {
            // Reset player position
            this.player.reset(100, this.height - 100);
        }
    }

    private updateUI(): void {
        const scoreElement = document.getElementById('scoreValue');
        const livesElement = document.getElementById('livesValue');
        const levelElement = document.getElementById('levelValue');
        
        if (scoreElement) scoreElement.textContent = this.score.toString();
        if (livesElement) livesElement.textContent = this.lives.toString();
        if (levelElement) levelElement.textContent = this.level.toString();
    }

    private checkGameState(): void {
        // Check if all coins and enemies are cleared
        if (this.coins.length === 0 && this.enemies.length === 0) {
            if (this.level === 1) {
                this.level = 2;
                this.initializeLevel();
                this.score += 1000; // Level completion bonus
                this.player.reset(100, this.height - 100);
                this.cameraX = 0; // Reset camera
            } else if (this.level === 2) {
                // Game completed!
                this.score += 2000; // Final completion bonus
                this.gameState = 'gameOver';
                this.onGameOver?.(this.score);
            }
        }
    }

    private updateCamera(): void {
        // Follow player with some offset
        const targetCameraX = this.player.x - this.width / 3;
        this.cameraX = Math.max(0, targetCameraX);
        
        // Limit camera to level bounds
        const maxCameraX = (this.width * 3) - this.width;
        this.cameraX = Math.min(this.cameraX, maxCameraX);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(-this.cameraX, 0);
        
        this.renderer.clear(ctx, this.width * 3, this.height);
        
        // Render platforms
        this.platforms.forEach(platform => {
            this.renderer.renderPlatform(ctx, platform);
        });

        // Render coins
        this.coins.forEach(coin => {
            this.renderer.renderCoin(ctx, coin);
        });

        // Render enemies
        this.enemies.forEach(enemy => {
            this.renderer.renderEnemy(ctx, enemy);
        });

        // Render player
        this.renderer.renderPlayer(ctx, this.player);
        
        ctx.restore();
    }

    public restart(): void {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameState = 'playing';
        this.cameraX = 0;
        this.player.reset(100, this.height - 100);
        this.initializeLevel();
    }
}