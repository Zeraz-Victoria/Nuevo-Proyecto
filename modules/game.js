export default class Game {
    constructor(app) {
        this.app = app;
        this.currentPhase = 1;
        this.currentStep = 0; // 0: Lectura, 1: Quiz/Actividad
        this.xp = 0;
        this.badges = [];

        // Fases expandidas
        this.phases = {
            1: {
                name: 'QUÍMICA DEL AGUA',
                status: 'PENDIENTE',
                steps: [
                    { type: 'library', contentId: 'chem-intro', title: 'LECTURA: QUÍMICA' },
                    { type: 'quiz', quizId: 'quiz-chem', title: 'EVALUACIÓN: QUÍMICA' },
                    { type: 'camera', title: 'ANÁLISIS VISUAL', notebook: true, notebookText: 'Dibuja el ciclo del nitrógeno en tu libreta.' }
                ],
                xp: 150,
                badge: 'Químico Experto',
                icon: '🧪'
            },
            2: {
                name: 'BIOLOGÍA DE PECES',
                status: 'BLOQUEADO',
                steps: [
                    { type: 'library', contentId: 'fish-bio', title: 'LECTURA: BIOLOGÍA' },
                    { type: 'quiz', quizId: 'quiz-bio', title: 'EVALUACIÓN: BIOLOGÍA' },
                    { type: 'audio', title: 'ANÁLISIS DE ESTRÉS', notebook: true, notebookText: 'Observa a los peces y anota signos de estrés o enfermedad.' }
                ],
                xp: 150,
                badge: 'Veterinario Acuático',
                icon: '🐟'
            },
            3: {
                name: 'MANTENIMIENTO',
                status: 'BLOQUEADO',
                steps: [
                    { type: 'library', contentId: 'feeding', title: 'LECTURA: ALIMENTACIÓN' },
                    { type: 'quiz', quizId: 'quiz-feeding', title: 'EVALUACIÓN: CÁLCULOS' },
                    { type: 'gyro', title: 'CALIBRACIÓN DE ALIMENTADOR', notebook: false }
                ],
                xp: 200,
                badge: 'Gerente de Producción',
                icon: '⚙️'
            },
            4: {
                name: 'PROYECTO FINAL',
                status: 'BLOQUEADO',
                steps: [
                    { type: 'camera', title: 'EVIDENCIA FINAL', notebook: true, notebookText: 'Diseña el plan de manejo completo para las próximas 4 semanas.' }
                ],
                xp: 500,
                badge: 'Maestro Acuaponista',
                icon: '🎓'
            }
        };
    }

    loadProgress() {
        const savedPhase = localStorage.getItem('eco_phase_v2');
        const savedStep = localStorage.getItem('eco_step_v2');
        const savedXP = localStorage.getItem('eco_xp_v2');
        const savedBadges = localStorage.getItem('eco_badges_v2');

        if (savedPhase) this.currentPhase = parseInt(savedPhase);
        if (savedStep) this.currentStep = parseInt(savedStep);
        if (savedXP) this.xp = parseInt(savedXP);
        if (savedBadges) this.badges = JSON.parse(savedBadges);

        // Actualizar estados
        for (let i = 1; i < this.currentPhase; i++) {
            this.phases[i].status = 'COMPLETADO';
        }
        if (this.currentPhase <= 4) {
            this.phases[this.currentPhase].status = 'PENDIENTE';
        }

        this.updateUI();
        this.updateXPDisplay();
        this.initUI();
    }

    saveProgress() {
        localStorage.setItem('eco_phase_v2', this.currentPhase);
        localStorage.setItem('eco_step_v2', this.currentStep);
        localStorage.setItem('eco_xp_v2', this.xp);
        localStorage.setItem('eco_badges_v2', JSON.stringify(this.badges));
    }

    initUI() {
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
        const phase = this.phases[phaseNum];
        const step = phase.steps[this.currentStep];

        if (!step) {
            // Error o fase terminada pero no avanzada
            this.completeCurrentPhase();
            return;
        }

        if (step.type === 'library') {
            this.app.loadLibrary(step.contentId, () => {
                this.advanceStep();
            });
        } else {
            this.app.loadActivity(step.type, step);
        }
    }

    advanceStep() {
        this.currentStep++;
        const phase = this.phases[this.currentPhase];

        if (this.currentStep >= phase.steps.length) {
            this.completeCurrentPhase();
        } else {
            this.saveProgress();
            // Cargar siguiente paso inmediatamente o volver al menú?
            // Mejor volver al menú para dar sensación de progreso
            alert('PASO COMPLETADO. SIGUIENTE ACTIVIDAD DESBLOQUEADA.');
            this.app.switchView('phases');
        }
    }

    completeCurrentPhase() {
        const phase = this.phases[this.currentPhase];

        this.xp += phase.xp;
        if (!this.badges.includes(phase.badge)) {
            this.badges.push({ name: phase.badge, icon: phase.icon, phase: this.currentPhase });
        }

        phase.status = 'COMPLETADO';
        this.currentPhase++;
        this.currentStep = 0; // Reset steps para nueva fase

        if (this.currentPhase <= 4) {
            this.phases[this.currentPhase].status = 'PENDIENTE';
        } else {
            setTimeout(() => {
                alert('¡CURSO COMPLETADO! HAS OBTENIDO EL DIPLOMA DE MAESTRO ACUAPONISTA.');
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
            const nameSpan = btn.querySelector('.phase-name');

            // Actualizar nombre según config nueva
            if (this.phases[phaseNum]) {
                nameSpan.innerText = this.phases[phaseNum].name;
            }

            btn.classList.remove('locked', 'active', 'completed');

            if (phaseNum < this.currentPhase) {
                btn.classList.add('completed');
                statusSpan.innerText = 'COMPLETADO';
                statusSpan.style.color = '#00ff41';
            } else if (phaseNum === this.currentPhase && this.currentPhase <= 4) {
                btn.classList.add('active');
                statusSpan.innerText = `EN PROGRESO (${this.currentStep}/${this.phases[phaseNum].steps.length})`;
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

        if (this.currentPhase > 4) {
            document.getElementById('diploma-section').classList.remove('hidden');
            document.getElementById('diploma-date').innerText = new Date().toLocaleDateString();
        }
    }
}
