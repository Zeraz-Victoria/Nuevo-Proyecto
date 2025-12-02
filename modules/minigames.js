export default class MinigameModule {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.activeGame = null;
        this.loopId = null;
    }

    start(gameId, container, onComplete) {
        container.innerHTML = '';
        this.canvas = document.createElement('canvas');
        this.canvas.width = 300;
        this.canvas.height = 300;
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.onComplete = onComplete;

        if (gameId === 'mud-cleaning') {
            this.startMudGame();
        } else if (gameId === 'pipe-connect') {
            this.startPipeGame();
        }
    }

    stop() {
        if (this.loopId) cancelAnimationFrame(this.loopId);
        this.canvas = null;
    }

    // --- MINIJUEGO 1: LIMPIEZA DE LODO (PASADO) ---
    startMudGame() {
        let muds = [];
        for (let i = 0; i < 5; i++) {
            muds.push({
                x: Math.random() * 200 + 50,
                y: Math.random() * 200 + 50,
                r: 30,
                active: true
            });
        }

        const draw = () => {
            if (!this.canvas) return;
            this.ctx.fillStyle = '#3e2723'; // Fondo tierra
            this.ctx.fillRect(0, 0, 300, 300);

            this.ctx.fillStyle = '#8d6e63'; // Lodo
            let remaining = 0;
            muds.forEach(m => {
                if (m.active) {
                    this.ctx.beginPath();
                    this.ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
                    this.ctx.fill();
                    remaining++;
                }
            });

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px monospace';
            this.ctx.fillText(`LODO RESTANTE: ${remaining}`, 10, 30);

            if (remaining === 0) {
                this.ctx.fillStyle = '#0f0';
                this.ctx.fillText('¡CANAL LIMPIO!', 80, 150);
                setTimeout(() => this.onComplete(true), 1000);
                return;
            }

            this.loopId = requestAnimationFrame(draw);
        };

        this.canvas.addEventListener('pointerdown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            muds.forEach(m => {
                const dist = Math.sqrt((x - m.x) ** 2 + (y - m.y) ** 2);
                if (dist < m.r) m.active = false;
            });
        });

        draw();
    }

    // --- MINIJUEGO 2: TUBERÍAS (FUTURO) ---
    startPipeGame() {
        // Simple click game: Click to rotate pipe to vertical
        let pipeRot = 90; // Grados

        const draw = () => {
            if (!this.canvas) return;
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, 300, 300);

            // Tubería A (Arriba)
            this.ctx.fillStyle = '#00e5ff';
            this.ctx.fillRect(130, 0, 40, 100);

            // Tubería B (Abajo)
            this.ctx.fillRect(130, 200, 40, 100);

            // Tubería Central (Rotable)
            this.ctx.save();
            this.ctx.translate(150, 150);
            this.ctx.rotate(pipeRot * Math.PI / 180);
            this.ctx.fillStyle = '#006064';
            if (pipeRot % 180 === 0) this.ctx.fillStyle = '#00e5ff'; // Conectado
            this.ctx.fillRect(-20, -50, 40, 100);
            this.ctx.restore();

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '16px monospace';
            this.ctx.fillText('TOCA PARA ROTAR', 80, 30);

            if (pipeRot % 180 === 0) {
                this.ctx.fillStyle = '#0f0';
                this.ctx.fillText('¡CONECTADO!', 100, 150);
                setTimeout(() => this.onComplete(true), 1000);
                return;
            }

            this.loopId = requestAnimationFrame(draw);
        };

        this.canvas.addEventListener('pointerdown', () => {
            pipeRot += 90;
        });

        draw();
    }
}
