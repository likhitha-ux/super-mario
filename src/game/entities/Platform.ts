export class Platform {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public type: string;

    constructor(x: number, y: number, width: number, height: number, type: string = 'ground') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }
}