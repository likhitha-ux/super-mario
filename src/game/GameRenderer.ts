import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { Coin } from './entities/Coin';
import { Platform } from './entities/Platform';

export class GameRenderer {
    public clear(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.6, '#87CEEB');
        gradient.addColorStop(0.6, '#90EE90');
        gradient.addColorStop(1, '#228B22');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add some clouds
        this.drawClouds(ctx, width, height);
    }

    private drawClouds(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Simple cloud shapes
        const clouds = [
            { x: 150, y: 80, size: 40 },
            { x: 400, y: 60, size: 50 },
            { x: 700, y: 90, size: 35 },
            { x: 900, y: 70, size: 45 },
            { x: 1200, y: 85, size: 38 },
            { x: 1500, y: 65, size: 42 },
            { x: 1800, y: 75, size: 40 },
            { x: 2100, y: 90, size: 35 }
        ];

        clouds.forEach(cloud => {
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.arc(cloud.x + 25, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
            ctx.arc(cloud.x + 50, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    public renderPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
        ctx.save();
        
        // Flip sprite if moving left
        if (player.direction === 'left') {
            ctx.scale(-1, 1);
            ctx.translate(-player.x - player.width, 0);
        }

        // Mario colors
        const colors = {
            hat: '#FF0000',
            skin: '#FFDBAC',
            shirt: '#FF0000',
            overalls: '#0066CC',
            shoes: '#8B4513'
        };

        // Draw Mario sprite (simplified pixel art)
        this.drawMarioSprite(ctx, player.x, player.y, colors, player.animationFrame, player);
        
        ctx.restore();
    }

    private drawMarioSprite(ctx: CanvasRenderingContext2D, x: number, y: number, colors: any, frame: number, player: Player): void {
        const pixelSize = 2;
        
        // Hat
        ctx.fillStyle = colors.hat;
        ctx.fillRect(x + 8 * pixelSize, y + 2 * pixelSize, 16 * pixelSize, 6 * pixelSize);
        
        // Face
        ctx.fillStyle = colors.skin;
        ctx.fillRect(x + 6 * pixelSize, y + 8 * pixelSize, 20 * pixelSize, 8 * pixelSize);
        
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 10 * pixelSize, y + 10 * pixelSize, 2 * pixelSize, 2 * pixelSize);
        ctx.fillRect(x + 20 * pixelSize, y + 10 * pixelSize, 2 * pixelSize, 2 * pixelSize);
        
        // Mustache
        ctx.fillRect(x + 12 * pixelSize, y + 14 * pixelSize, 8 * pixelSize, 2 * pixelSize);
        
        // Shirt
        ctx.fillStyle = colors.shirt;
        ctx.fillRect(x + 4 * pixelSize, y + 16 * pixelSize, 24 * pixelSize, 8 * pixelSize);
        
        // Overalls
        ctx.fillStyle = colors.overalls;
        ctx.fillRect(x + 6 * pixelSize, y + 20 * pixelSize, 20 * pixelSize, 8 * pixelSize);
        
        // Legs (animated)
        const legOffset = Math.abs(player.velocityX) > 10 ? (frame % 2) * 2 : 0;
        ctx.fillRect(x + (8 + legOffset) * pixelSize, y + 24 * pixelSize, 6 * pixelSize, 8 * pixelSize);
        ctx.fillRect(x + (18 - legOffset) * pixelSize, y + 24 * pixelSize, 6 * pixelSize, 8 * pixelSize);
        
        // Shoes
        ctx.fillStyle = colors.shoes;
        ctx.fillRect(x + (6 + legOffset) * pixelSize, y + 28 * pixelSize, 10 * pixelSize, 4 * pixelSize);
        ctx.fillRect(x + (16 - legOffset) * pixelSize, y + 28 * pixelSize, 10 * pixelSize, 4 * pixelSize);
    }

    public renderEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
        if (enemy.type === 'goomba') {
            this.drawGoomba(ctx, enemy.x, enemy.y, enemy.animationFrame);
        }
    }

    private drawGoomba(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number): void {
        const pixelSize = 2;
        
        // Body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 2 * pixelSize, y + 4 * pixelSize, 24 * pixelSize, 16 * pixelSize);
        
        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 6 * pixelSize, y + 8 * pixelSize, 4 * pixelSize, 4 * pixelSize);
        ctx.fillRect(x + 18 * pixelSize, y + 8 * pixelSize, 4 * pixelSize, 4 * pixelSize);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 8 * pixelSize, y + 10 * pixelSize, 2 * pixelSize, 2 * pixelSize);
        ctx.fillRect(x + 20 * pixelSize, y + 10 * pixelSize, 2 * pixelSize, 2 * pixelSize);
        
        // Angry eyebrows
        ctx.fillRect(x + 6 * pixelSize, y + 6 * pixelSize, 6 * pixelSize, 2 * pixelSize);
        ctx.fillRect(x + 16 * pixelSize, y + 6 * pixelSize, 6 * pixelSize, 2 * pixelSize);
        
        // Feet (animated)
        const footOffset = frame % 2;
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + (4 + footOffset) * pixelSize, y + 20 * pixelSize, 8 * pixelSize, 4 * pixelSize);
        ctx.fillRect(x + (16 - footOffset) * pixelSize, y + 20 * pixelSize, 8 * pixelSize, 4 * pixelSize);
    }

    public renderCoin(ctx: CanvasRenderingContext2D, coin: Coin): void {
        if (coin.collected) return;

        const centerX = coin.x + coin.width / 2;
        const centerY = coin.y + coin.height / 2;
        
        // Rotating coin effect
        const rotation = (Date.now() * 0.01) % (Math.PI * 2);
        const scale = Math.abs(Math.cos(rotation));
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(scale, 1);
        
        // Coin body
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner shine
        ctx.fillStyle = '#FFF700';
        ctx.beginPath();
        ctx.arc(-2, -2, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }

    public renderPlatform(ctx: CanvasRenderingContext2D, platform: Platform): void {
        if (platform.type === 'ground') {
            // Ground texture
            ctx.fillStyle = '#228B22';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Grass texture
            ctx.fillStyle = '#32CD32';
            for (let i = 0; i < platform.width; i += 8) {
                ctx.fillRect(platform.x + i, platform.y, 4, 8);
            }
        } else {
            // Regular platform
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Platform border
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
            
            // Platform details
            ctx.fillStyle = '#A0522D';
            for (let i = 0; i < platform.width; i += 32) {
                ctx.fillRect(platform.x + i + 4, platform.y + 4, 24, platform.height - 8);
            }
        }
    }
}