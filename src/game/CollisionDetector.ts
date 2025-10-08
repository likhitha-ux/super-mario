export class CollisionDetector {
    public checkCollision(obj1: any, obj2: any): boolean {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    public checkPointCollision(pointX: number, pointY: number, obj: any): boolean {
        return pointX >= obj.x &&
               pointX <= obj.x + obj.width &&
               pointY >= obj.y &&
               pointY <= obj.y + obj.height;
    }
}