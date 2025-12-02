export default class Game {
    constructor(app) {
        this.app = app;
        this.currentPhase = 1;
        this.xp = 0;
        this.badges = [];

        this.phases = {
            1: { name: 'DIAGNÓSTICO', status: 'PENDIENTE', type: 'camera', title: 'ESCANEO DE BIO-FILTRO', notebook: true, notebookText: 'Dibuja el estado actual de las plantas y anota si observas plagas.', xp: 100, badge: 'Observador Eco', icon: '👁️' },
            2: { name: 'DISEÑO', status: 'BLOQUEADO', type: 'audio', title: 'ANÁLISIS SONORO', notebook: true, notebookText: 'Diseña un esquema de flujo de agua silencioso basado en el análisis.', xp: 150, badge: 'Ingeniero Acústico', icon: '🔊' },
            3: { name: 'ACCIÓN', status: 'BLOQUEADO', type: 'gyro', title: 'CALIBRACIÓN DE TUBERÍAS', notebook: false, xp: 200, badge: 'Maestro del Equilibrio', icon: '⚖️' },
            4: { name: 'REFLEXIÓN', status: 'BLOQUEADO', type: 'camera', title: 'EVIDENCIA FINAL', notebook: true, notebookText: 'Escribe una reflexión sobre cómo la tecnología ayudó a recuperar el huerto.', xp: 300, badge: 'Guardián del Ecosistema', icon: '🛡️' }
        };
    }

    loadProgress() {
        const savedPhase = localStorage.getItem('eco_phase');
        const savedXP = localStorage.getItem('eco_xp');
        const savedBadges = localStorage.getItem('eco_badges');

        if (savedPhase) this.currentPhase = parseInt(savedPhase);
        if (savedXP) this.xp = parseInt(savedXP);
        if (savedBadges) this.badges = JSON.parse(savedBadges);

        // Actualizar estados de fases anteriores
        for (let i = 1; i < this.currentPhase; i++) {
            this.phases[i].status = 'COMPLETADO';
        }
        if (this.currentPhase <= 4) {
            this.phases[this.currentPhase].status = 'PENDIENTE';
        }

        this.updateUI();
        this.updateXPDisplay();
        this.initUI(); // Re-attach listeners
    }

    saveProgress() {
        localStorage.setItem('eco_phase', this.currentPhase);
        localStorage.setItem('eco_xp', this.xp);
        localStorage.setItem('eco_badges', JSON.stringify(this.badges));
    }

    initUI() {
        // Limpiar listeners antiguos para evitar duplicados (simple approach)
        const oldButtons = document.querySelectorAll('.phase-card');
        oldButtons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });

        const buttons = document.querySelectorAll('.phase-card');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const phaseNum = parseInt(btn.dataset.phase);
                if (phaseNum === this.currentPhase) {
                    this.startPhase(phaseNum);
                } else if (phaseNum < this.currentPhase) {
                    alert('FASE YA COMPLETADA');
                } else {
                    this.app.audio.playError();
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
        const phase = this.phases[this.currentPhase];

        // Dar recompensas
        this.xp += phase.xp;
        if (!this.badges.includes(phase.badge)) {
            this.badges.push({ name: phase.badge, icon: phase.icon, phase: this.currentPhase });
        }

        phase.status = 'COMPLETADO';
        this.currentPhase++;

        if (this.currentPhase <= 4) {
            this.phases[this.currentPhase].status = 'PENDIENTE';
        } else {
            // Juego completado
            setTimeout(() => {
                alert('¡MISIÓN CUMPLIDA! HAS OBTENIDO EL DIPLOMA DE EXCELENCIA.');
                this.app.game.updateProfileUI();
                this.app.switchView('profile');
            }, 1000);
        }

        this.saveProgress();
        this.updateUI();
        this.updateXPDisplay();
    }

    updateXPDisplay() {
        const el = document.getElementById('xp-display');
        if (el) el.innerText = `XP: ${this.xp}`;

        const levelEl = document.getElementById('profile-level');
        if (levelEl) levelEl.innerText = Math.floor(this.xp / 100) + 1;
    }

    updateUI() {
        const buttons = document.querySelectorAll('.phase-card');
        buttons.forEach(btn => {
            const phaseNum = parseInt(btn.dataset.phase);
            const statusSpan = btn.querySelector('.phase-status');

            btn.classList.remove('locked', 'active', 'completed');

            if (phaseNum < this.currentPhase) {
                btn.classList.add('completed');
                statusSpan.innerText = 'COMPLETADO';
                statusSpan.style.color = '#00ff41';
            } else if (phaseNum === this.currentPhase && this.currentPhase <= 4) {
                btn.classList.add('active');
                statusSpan.innerText = 'DISPONIBLE';
                statusSpan.style.color = '#ffff00';
            } else {
                btn.classList.add('locked');
                statusSpan.innerText = 'BLOQUEADO';
                statusSpan.style.color = '#666';
            }
        });
    }

    updateProfileUI() {
        const container = document.getElementById('badge-container');
        container.innerHTML = '';

        // Mostrar todas las posibles insignias (bloqueadas o desbloqueadas)
        Object.values(this.phases).forEach(p => {
            const unlocked = this.badges.find(b => b.name === p.badge);
            const div = document.createElement('div');
            div.className = `badge ${unlocked ? 'unlocked' : ''}`;
            div.innerHTML = `
                <span class="badge-icon">${p.icon}</span>
                <span class="badge-name">${p.badge}</span>
            `;
            container.appendChild(div);
        });

        // Mostrar diploma si se completaron las 4 fases
        if (this.currentPhase > 4) {
            document.getElementById('diploma-section').classList.remove('hidden');
            document.getElementById('diploma-date').innerText = new Date().toLocaleDateString();
        }
    }
}
