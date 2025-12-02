import NarrativeModule from './modules/narrative.js';
import MinigameModule from './modules/minigames.js';

class App {
    constructor() {
        this.narrative = new NarrativeModule();
        this.minigames = new MinigameModule();

        this.state = {
            agentName: localStorage.getItem('agentName') || '',
            currentEra: 'future',
            progress: {
                pastCompleted: localStorage.getItem('pastCompleted') === 'true',
                futureCompleted: localStorage.getItem('futureCompleted') === 'true'
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

        document.getElementById('btn-start-game').addEventListener('click', () => this.registerAgent());

        // Botones de Era
        this.btnPast = document.getElementById('btn-era-past');
        this.btnFuture = document.getElementById('btn-era-future');
        this.btnFinal = document.getElementById('btn-era-final');

        this.btnPast.addEventListener('click', () => this.travelToEra('past'));
        this.btnFuture.addEventListener('click', () => {
            if (this.state.progress.pastCompleted) this.travelToEra('future');
        });

        document.getElementById('btn-next-dialogue').addEventListener('click', () => this.advanceDialogue());
        document.getElementById('btn-back-timeline').addEventListener('click', () => this.switchView('timeline'));

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

    updateTimelineUI() {
        // Bloquear/Desbloquear según progreso
        if (this.state.progress.pastCompleted) {
            this.btnFuture.classList.remove('locked');
            this.btnFuture.style.opacity = '1';
            this.btnPast.innerHTML = '<div class="era-title">1350: XOCHIMILCO</div><div style="color:#0f0">¡MISIÓN COMPLETADA!</div>';
        } else {
            this.btnFuture.classList.add('locked');
            this.btnFuture.innerHTML = '<div class="era-title">2050: BLOQUEADO</div><div>Completa el Pasado primero</div>';
        }

        if (this.state.progress.futureCompleted) {
            this.btnFinal.classList.remove('locked');
            this.btnFinal.style.opacity = '1';
            this.btnFuture.innerHTML = '<div class="era-title">2050: NEO-MÉXICO</div><div style="color:#0f0">¡MISIÓN COMPLETADA!</div>';
        }
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
        const dialogueId = era === 'past' ? 'past-1' : 'future-1';
        this.startDialogue(dialogueId);
    }

    startDialogue(id) {
        this.switchView('dialogue');
        this.currentDialogueSequence = this.narrative.getDialogue(id);
        this.dialogueIndex = 0;
        this.showDialogueStep();
    }

    showDialogueStep() {
        if (!this.currentDialogueSequence || this.dialogueIndex >= this.currentDialogueSequence.length) {
            this.switchView('timeline');
            return;
        }

        const step = this.currentDialogueSequence[this.dialogueIndex];
        const charEl = document.getElementById('dialogue-char');
        const textEl = document.getElementById('dialogue-text');
        const nextBtn = document.getElementById('btn-next-dialogue');
        const optionsEl = document.getElementById('dialogue-options');
        const avatarEl = document.getElementById('char-avatar');

        if (step.char === 'CITLALI') avatarEl.innerText = '👵🏽';
        else if (step.char === 'NEO') avatarEl.innerText = '👨🏻‍💻';
        else avatarEl.innerText = '🤖';

        charEl.innerText = step.char;
        textEl.innerText = step.text;

        optionsEl.classList.add('hidden');
        nextBtn.classList.remove('hidden');

        if (step.options) {
            nextBtn.classList.add('hidden');
            this.showOptions(step.options);
        } else if (step.action) {
            nextBtn.classList.add('hidden');
            setTimeout(() => this.handleAction(step.action), 2000);
        }
    }

    showOptions(options) {
        const container = document.getElementById('dialogue-options');
        container.innerHTML = '';
        container.classList.remove('hidden');

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-option';
            btn.innerText = `> ${opt.text}`;
            btn.onclick = () => {
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
            this.startMinigame('mud-cleaning', 'LIMPIEZA DE CANALES');
        } else if (action === 'start-mission-2') {
            this.startMinigame('pipe-connect', 'CONEXIÓN DE TUBERÍAS');
        } else if (action === 'retry-future-1') {
            this.startDialogue('future-1');
        }
    }

    startMinigame(id, title) {
        this.switchView('activity');
        document.getElementById('activity-title').innerText = title;
        const container = document.getElementById('activity-content');

        this.minigames.start(id, container, (success) => {
            if (success) {
                alert('¡MISIÓN COMPLETADA!');
                this.completeMission(id);
            }
        });
    }

    completeMission(gameId) {
        if (gameId === 'mud-cleaning') {
            this.state.progress.pastCompleted = true;
            localStorage.setItem('pastCompleted', 'true');
        } else if (gameId === 'pipe-connect') {
            this.state.progress.futureCompleted = true;
            localStorage.setItem('futureCompleted', 'true');
        }
        this.switchView('timeline');
    }

    switchView(viewName) {
        Object.values(this.views).forEach(el => {
            el.classList.remove('active');
            el.classList.add('hidden');
        });

        const target = this.views[viewName];
        target.classList.remove('hidden');

        if (viewName === 'timeline') {
            this.updateTimelineUI();
            // Reset theme to default/future for menu
            if (!this.state.progress.pastCompleted) {
                this.setTheme('future');
            }
        }

        setTimeout(() => target.classList.add('active'), 50);
    }
}

window.app = new App();
