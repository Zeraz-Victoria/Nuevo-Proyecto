import NarrativeModule from './modules/narrative.js';
import CameraModule from './modules/camera.js';
import AudioModule from './modules/audio.js';
import SensorsModule from './modules/sensors.js';

class App {
    constructor() {
        this.narrative = new NarrativeModule();
        this.camera = new CameraModule();
        this.audio = new AudioModule();
        this.sensors = new SensorsModule();

        this.state = {
            agentName: localStorage.getItem('agentName') || '',
            currentEra: 'future', // 'past' or 'future'
            progress: {
                past: false,
                future: false
            }
        };

        this.views = {
            intro: document.getElementById('view-intro'),
            timeline: document.getElementById('view-timeline'),
            dialogue: document.getElementById('view-dialogue'),
            activity: document.getElementById('view-activity')
        };

        this.init();
    }

    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        // Event Listeners
        document.getElementById('btn-start-game').addEventListener('click', () => this.registerAgent());

        document.getElementById('btn-era-past').addEventListener('click', () => this.travelToEra('past'));
        document.getElementById('btn-era-future').addEventListener('click', () => this.travelToEra('future'));

        document.getElementById('btn-next-dialogue').addEventListener('click', () => this.advanceDialogue());
        document.getElementById('btn-back-timeline').addEventListener('click', () => this.switchView('timeline'));

        // Check login
        if (this.state.agentName) {
            this.switchView('timeline');
        } else {
            this.switchView('intro');
        }
    }

    updateClock() {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    registerAgent() {
        const name = document.getElementById('input-name').value.trim();
        if (name) {
            this.state.agentName = name;
            localStorage.setItem('agentName', name);
            this.startDialogue('intro');
        }
    }

    setTheme(era) {
        document.body.classList.remove('theme-past', 'theme-future');
        document.body.classList.add(`theme-${era}`);
        this.state.currentEra = era;
    }

    travelToEra(era) {
        this.setTheme(era);
        // Iniciar diálogo correspondiente a la era si es la primera vez
        // Simplificado: Siempre inicia diálogo por ahora
        const dialogueId = era === 'past' ? 'past-1' : 'future-1';
        this.startDialogue(dialogueId);
    }

    // --- LOGICA DE DIALOGO ---
    startDialogue(id) {
        this.switchView('dialogue');
        this.currentDialogueSequence = this.narrative.getDialogue(id);
        this.dialogueIndex = 0;
        this.showDialogueStep();
    }

    showDialogueStep() {
        if (this.dialogueIndex >= this.currentDialogueSequence.length) {
            // Fin de secuencia
            this.switchView('timeline');
            return;
        }

        const step = this.currentDialogueSequence[this.dialogueIndex];
        const charEl = document.getElementById('dialogue-char');
        const textEl = document.getElementById('dialogue-text');
        const nextBtn = document.getElementById('btn-next-dialogue');
        const optionsEl = document.getElementById('dialogue-options');
        const avatarEl = document.getElementById('char-avatar');

        // Configurar Avatar
        if (step.char === 'CITLALI') avatarEl.innerText = '👵🏽';
        else if (step.char === 'NEO') avatarEl.innerText = '👨🏻‍💻';
        else avatarEl.innerText = '🤖';

        charEl.innerText = step.char;
        textEl.innerText = '';
        optionsEl.classList.add('hidden');
        nextBtn.classList.add('hidden');

        // Efecto Typewriter
        let i = 0;
        const typeInterval = setInterval(() => {
            textEl.innerText += step.text.charAt(i);
            i++;
            if (i >= step.text.length) {
                clearInterval(typeInterval);

                if (step.options) {
                    this.showOptions(step.options);
                } else if (step.action) {
                    // Auto-ejecutar acción tras delay
                    setTimeout(() => this.handleAction(step.action), 1000);
                } else {
                    nextBtn.classList.remove('hidden');
                }
            }
        }, 30);
    }

    showOptions(options) {
        const container = document.getElementById('dialogue-options');
        container.innerHTML = '';
        container.classList.remove('hidden');

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = `> ${opt.text}`;
            btn.onclick = () => {
                // Cargar siguiente secuencia basada en la opción
                this.currentDialogueSequence = this.narrative.getDialogue(opt.next);
                this.dialogueIndex = 0;
                this.showDialogueStep();
            };
            container.appendChild(btn);
        });
    }

    advanceDialogue() {
        this.dialogueIndex++;
        this.showDialogueStep();
    }

    handleAction(action) {
        if (action === 'start-mission-1') {
            alert('MISIÓN INICIADA: EL SECRETO DEL LODO (Simulación)');
            this.switchView('timeline');
        } else if (action === 'start-mission-2') {
            alert('MISIÓN INICIADA: RECALIBRACIÓN (Simulación)');
            this.switchView('timeline');
        } else if (action === 'retry-future-1') {
            alert('INTENTA DE NUEVO. PIENSA EN EL CICLO.');
            this.startDialogue('future-1');
        }
    }

    switchView(viewName) {
        Object.values(this.views).forEach(el => {
            el.classList.remove('active');
            el.classList.add('hidden');
        });

        const target = this.views[viewName];
        target.classList.remove('hidden');
        // Pequeño delay para la transición de opacidad
        setTimeout(() => target.classList.add('active'), 50);
    }
}

window.app = new App();
