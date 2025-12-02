export default class Game {
    constructor(app) {
        this.app = app;
        this.currentPhase = 1;
        this.phases = {
            1: { name: 'DIAGNÓSTICO', status: 'PENDIENTE', type: 'camera', title: 'ESCANEO DE BIO-FILTRO', notebook: true, notebookText: 'Dibuja el estado actual de las plantas y anota si observas plagas.' },
            2: { name: 'DISEÑO', status: 'BLOQUEADO', type: 'audio', title: 'ANÁLISIS SONORO', notebook: true, notebookText: 'Diseña un esquema de flujo de agua silencioso basado en el análisis.' },
            3: { name: 'ACCIÓN', status: 'BLOQUEADO', type: 'gyro', title: 'CALIBRACIÓN DE TUBERÍAS', notebook: false },
            4: { name: 'REFLEXIÓN', status: 'BLOQUEADO', type: 'camera', title: 'EVIDENCIA FINAL', notebook: true, notebookText: 'Escribe una reflexión sobre cómo la tecnología ayudó a recuperar el huerto.' }
        };

        this.initUI();
    }

    initUI() {
        const buttons = document.querySelectorAll('.phase-card');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const phaseNum = parseInt(btn.dataset.phase);
                if (phaseNum === this.currentPhase) {
                    this.startPhase(phaseNum);
                } else if (phaseNum < this.currentPhase) {
                    alert('FASE YA COMPLETADA');
                } else {
                    this.app.audio.playError(); // Sonido de error
                }
            });
        });
        this.updateUI();
    }

    startPhase(phaseNum) {
        const config = this.phases[phaseNum];
        this.app.loadActivity(config.type, config);
    }

    completeCurrentPhase() {
        this.phases[this.currentPhase].status = 'COMPLETADO';
        this.currentPhase++;
        if (this.currentPhase <= 4) {
            this.phases[this.currentPhase].status = 'PENDIENTE';
        } else {
            alert('¡MISIÓN CUMPLIDA! ECOSISTEMA RESTAURADO.');
        }
        this.updateUI();
    }

    updateUI() {
        const buttons = document.querySelectorAll('.phase-card');
        buttons.forEach(btn => {
            const phaseNum = parseInt(btn.dataset.phase);
            const statusSpan = btn.querySelector('.phase-status');

            // Reset clases
            btn.classList.remove('locked', 'active', 'completed');

            if (phaseNum < this.currentPhase) {
                btn.classList.add('completed');
                statusSpan.innerText = 'COMPLETADO';
                statusSpan.style.color = '#00ff41';
            } else if (phaseNum === this.currentPhase) {
                btn.classList.add('active'); // Clase visual para el actual
                statusSpan.innerText = 'DISPONIBLE';
                statusSpan.style.color = '#ffff00';
            } else {
                btn.classList.add('locked');
                statusSpan.innerText = 'BLOQUEADO';
                statusSpan.style.color = '#666';
            }
        });
    }
}
