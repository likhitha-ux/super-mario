import { Game } from './game/Game';
import { InputHandler } from './game/InputHandler';
import { SoundManager } from './game/SoundManager';

class GameApp {
    private game: Game;
    private inputHandler: InputHandler;
    private soundManager: SoundManager;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private lastTime: number = 0;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        
        this.inputHandler = new InputHandler();
        this.soundManager = new SoundManager();
        this.game = new Game(this.canvas.width, this.canvas.height, this.inputHandler, this.soundManager);
        
        this.setupEventListeners();
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }

    private setupEventListeners(): void {
        const restartBtn = document.getElementById('restartBtn');
        restartBtn?.addEventListener('click', () => {
            this.game.restart();
            this.hideGameOver();
        });

        // Handle game over
        this.game.onGameOver = (score: number) => {
            this.showGameOver(score);
        };
    }

    private gameLoop(currentTime: number): void {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.game.update(deltaTime);
        this.game.render(this.ctx);

        requestAnimationFrame(this.gameLoop);
    }

    private showGameOver(score: number): void {
        const gameOverDiv = document.getElementById('gameOver');
        const finalScore = document.getElementById('finalScore');
        const gameOverReason = document.getElementById('gameOverReason');
        
        if (finalScore) finalScore.textContent = score.toString();
        
        // Check if player completed the game
        if (this.game.level > 2) {
            if (gameOverReason) gameOverReason.textContent = 'Congratulations! You completed the game!';
        } else {
            if (gameOverReason) gameOverReason.textContent = 'You ran out of lives!';
        }
        
        if (gameOverDiv) gameOverDiv.classList.remove('hidden');
    }

    private hideGameOver(): void {
        const gameOverDiv = document.getElementById('gameOver');
        if (gameOverDiv) gameOverDiv.classList.add('hidden');
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new GameApp();
});