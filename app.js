import Game from './modules/game.js';
import CameraModule from './modules/camera.js';
import AudioModule from './modules/audio.js';
import SensorsModule from './modules/sensors.js';

class App {
    constructor() {
        this.game = new Game(this);
        this.camera = new CameraModule();
        this.audio = new AudioModule();
        this.sensors = new SensorsModule();

        this.views = {
            register: document.getElementById('view-register'),
            home: document.getElementById('view-home'),
            phases: document.getElementById('view-phases'),
            activity: document.getElementById('view-activity'),
            profile: document.getElementById('view-profile')
        };

        this.init();
    }

    init() {
        // Verificar usuario
        const savedName = localStorage.getItem('eco_agent_name');
        if (savedName) {
            this.setAgentName(savedName);
            this.switchView('home');
        } else {
            this.switchView('register');
        }

        // Event Listeners Globales
        document.getElementById('btn-register').addEventListener('click', () => {
            const name = document.getElementById('input-name').value.trim();
            if (name) {
                localStorage.setItem('eco_agent_name', name);
                this.setAgentName(name);
                this.audio.playSuccess();
                this.switchView('home');
            } else {
                this.audio.playError();
            }
        });

        document.getElementById('btn-start').addEventListener('click', () => {
            this.audio.playClick();
            this.switchView('phases');
        });

        document.getElementById('btn-profile').addEventListener('click', () => {
            this.audio.playClick();
            this.game.updateProfileUI();
            this.switchView('profile');
        });

        document.getElementById('btn-back').addEventListener('click', () => {
            this.audio.playClick();
            this.stopActiveModules();
            this.switchView('phases');
        });

        document.getElementById('btn-back-home').addEventListener('click', () => {
            this.audio.playClick();
            this.switchView('home');
        });

        document.getElementById('btn-back-profile').addEventListener('click', () => {
            this.audio.playClick();
            this.switchView('home');
        });

        // Inicializar reloj
        setInterval(() => {
            const now = new Date();
            document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }, 1000);

        // Inicializar sensores globales
        this.sensors.initGlobalSensors();

        // Cargar progreso guardado
        this.game.loadProgress();

        console.log('Eco-Sistema v2.0 Iniciado');
    }

    setAgentName(name) {
        document.getElementById('agent-name-display').innerText = name;
        document.getElementById('profile-name').innerText = `AGENTE ${name.toUpperCase()}`;
        document.getElementById('diploma-name').innerText = name.toUpperCase();
    }

    switchView(viewName) {
        Object.values(this.views).forEach(el => {
            if (el) {
                el.classList.add('hidden');
                el.classList.remove('active');
            }
        });

        const target = this.views[viewName];
        if (target) {
            target.classList.remove('hidden');
            setTimeout(() => target.classList.add('active'), 50);
        }
    }

    stopActiveModules() {
        this.camera.stop();
        this.audio.stopVisualization();
        this.sensors.stopLevelGame();
        document.getElementById('activity-content').innerHTML = '';
        document.getElementById('notebook-instruction').classList.add('hidden');
    }

    loadActivity(type, config) {
        this.switchView('activity');
        const container = document.getElementById('activity-content');
        document.getElementById('activity-title').innerText = config.title;

        if (type === 'camera') {
            this.camera.start(container);
        } else if (type === 'audio') {
            this.audio.startVisualization(container);
        } else if (type === 'gyro') {
            this.sensors.startLevelGame(container);
        }

        if (config.notebook) {
            const nb = document.getElementById('notebook-instruction');
            nb.classList.remove('hidden');
            document.getElementById('notebook-text').innerText = config.notebookText;

            document.getElementById('btn-verify-notebook').onclick = () => {
                this.audio.playSuccess();
                alert('ACTIVIDAD VERIFICADA. DATOS GUARDADOS EN DISPOSITIVO.');
                this.game.completeCurrentPhase();
                this.stopActiveModules();
                this.switchView('phases');
            };
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
