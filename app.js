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
            home: document.getElementById('view-home'),
            phases: document.getElementById('view-phases'),
            activity: document.getElementById('view-activity')
        };

        this.init();
    }

    init() {
        // Event Listeners Globales
        document.getElementById('btn-start').addEventListener('click', () => {
            this.audio.playClick();
            this.switchView('phases');
        });

        document.getElementById('btn-back').addEventListener('click', () => {
            this.audio.playClick();
            this.stopActiveModules();
            this.switchView('phases');
        });

        // Inicializar reloj
        setInterval(() => {
            const now = new Date();
            document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }, 1000);

        // Inicializar sensores globales (batería, orientación básica para UI)
        this.sensors.initGlobalSensors();
        
        console.log('Eco-Sistema Iniciado');
    }

    switchView(viewName) {
        // Ocultar todas
        Object.values(this.views).forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('active');
        });

        // Mostrar target
        const target = this.views[viewName];
        if (target) {
            target.classList.remove('hidden');
            // Pequeño delay para la transición de opacidad
            setTimeout(() => target.classList.add('active'), 50);
        }
    }

    stopActiveModules() {
        this.camera.stop();
        this.audio.stopVisualization();
        this.sensors.stopLevelGame();
        document.getElementById('activity-content').innerHTML = ''; // Limpiar contenedor
        document.getElementById('notebook-instruction').classList.add('hidden');
    }

    // Método para cargar una actividad específica
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

        // Si requiere libreta
        if (config.notebook) {
            const nb = document.getElementById('notebook-instruction');
            nb.classList.remove('hidden');
            document.getElementById('notebook-text').innerText = config.notebookText;
            
            document.getElementById('btn-verify-notebook').onclick = () => {
                this.audio.playSuccess();
                alert('ACTIVIDAD VERIFICADA. DATOS REGISTRADOS.');
                this.game.completeCurrentPhase();
                this.stopActiveModules();
                this.switchView('phases');
            };
        }
    }
}

// Iniciar App cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
