export class SoundManager {
    private audioContext: AudioContext;
    private sounds: { [key: string]: AudioBuffer } = {};
    private enabled: boolean = true;

    constructor() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.generateSounds();
        } catch (error) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    private generateSounds(): void {
        if (!this.enabled) return;

        // Generate simple sound effects using oscillators
        this.createSound('jump', 440, 0.1, 'square');
        this.createSound('coin', 660, 0.15, 'sine');
        this.createSound('stomp', 220, 0.1, 'triangle');
        this.createSound('hurt', 150, 0.3, 'sawtooth');
    }

    private createSound(name: string, frequency: number, duration: number, type: OscillatorType): void {
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            let sample = 0;

            switch (type) {
                case 'sine':
                    sample = Math.sin(2 * Math.PI * frequency * t);
                    break;
                case 'square':
                    sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
                    break;
                case 'triangle':
                    sample = 2 * Math.abs(2 * ((frequency * t) % 1) - 1) - 1;
                    break;
                case 'sawtooth':
                    sample = 2 * ((frequency * t) % 1) - 1;
                    break;
            }

            // Apply envelope for smoother sound
            const envelope = 1 - (t / duration);
            channelData[i] = sample * envelope * 0.3;
        }

        this.sounds[name] = buffer;
    }

    public playSound(name: string): void {
        if (!this.enabled || !this.sounds[name]) return;

        try {
            const source = this.audioContext.createBufferSource();
            source.buffer = this.sounds[name];
            source.connect(this.audioContext.destination);
            source.start();
        } catch (error) {
            console.warn('Failed to play sound:', error);
        }
    }
}