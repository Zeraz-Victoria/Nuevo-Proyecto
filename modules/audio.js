export default class AudioModule {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.animationId = null;
    }

    playClick() {
        this.beep(800, 0.05, 'square');
    }

    playError() {
        this.beep(200, 0.3, 'sawtooth');
    }

    playSuccess() {
        this.beep(1200, 0.1, 'sine');
        setTimeout(() => this.beep(1800, 0.2, 'sine'), 100);
    }

    beep(freq, duration, type) {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + duration);
        osc.stop(this.audioContext.currentTime + duration);
    }

    async startVisualization(container) {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        // Crear UI específica si no existe
        if (!document.getElementById('audio-visualizer')) {
            const vis = document.createElement('div');
            vis.id = 'audio-visualizer';
            vis.style.width = '100%';
            vis.style.height = '100px';
            vis.style.background = '#000';
            vis.style.border = '1px solid #00ff41';
            vis.style.display = 'flex';
            vis.style.alignItems = 'flex-end';
            vis.style.justifyContent = 'space-around';
            container.appendChild(vis);
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 32;
            this.microphone.connect(this.analyser);

            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);

            this.draw();
        } catch (err) {
            console.error("Error accediendo al micrófono:", err);
            container.innerHTML += '<p style="color:red">ERROR: MICRÓFONO NO DISPONIBLE</p>';
        }
    }

    draw() {
        if (!this.analyser) return;

        this.animationId = requestAnimationFrame(() => this.draw());
        this.analyser.getByteFrequencyData(this.dataArray);

        const container = document.getElementById('audio-visualizer');
        if (container) {
            container.innerHTML = ''; // Limpiar frame anterior
            // Dibujar barras simples
            for (let i = 0; i < this.dataArray.length; i++) {
                const barHeight = this.dataArray[i];
                const bar = document.createElement('div');
                bar.style.width = '5px';
                bar.style.height = barHeight / 2 + 'px';
                bar.style.background = '#00ff41';
                container.appendChild(bar);
            }

            // Actualizar barra global del footer también
            const avg = this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length;
            const globalBar = document.getElementById('audio-bar');
            if (globalBar) {
                globalBar.style.width = (avg / 255 * 100) + '%';
            }
        }
    }

    stopVisualization() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone = null;
        }
        // No cerramos el audioContext para poder seguir haciendo beeps
    }
}
