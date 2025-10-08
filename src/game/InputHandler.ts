export class InputHandler {
    public keys: { [key: string]: boolean } = {};

    constructor() {
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Prevent default behavior for game keys
            if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Handle window losing focus
        window.addEventListener('blur', () => {
            this.keys = {};
        });
    }
}