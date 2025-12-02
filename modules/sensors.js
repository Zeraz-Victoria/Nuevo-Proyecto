export default class SensorsModule {
    constructor() {
        this.gyroHandler = null;
        this.animationId = null;
    }

    initGlobalSensors() {
        // Intentar leer batería
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const updateBattery = () => {
                    document.getElementById('battery-level').innerText = `BATT: ${Math.round(battery.level * 100)}%`;
                };
                updateBattery();
                battery.addEventListener('levelchange', updateBattery);
            });
        }

        // Leer orientación básica para el footer
        window.addEventListener('deviceorientation', (event) => {
            const x = Math.round(event.beta);  // Inclinación frontal/trasera
            const y = Math.round(event.gamma); // Inclinación izquierda/derecha
            const z = Math.round(event.alpha); // Brújula

            const el = document.getElementById('gyro-val');
            if (el) el.innerText = `${x}, ${y}, ${z}`;
        });
    }

    startLevelGame(container) {
        // Crear elementos del juego
        const gameContainer = document.createElement('div');
        gameContainer.className = 'level-game';

        const target = document.createElement('div');
        target.className = 'level-target';

        const bubble = document.createElement('div');
        bubble.className = 'level-bubble';

        gameContainer.appendChild(target);
        gameContainer.appendChild(bubble);
        container.appendChild(gameContainer);

        const instruction = document.createElement('p');
        instruction.innerText = 'NIVELA LA BURBUJA EN EL CENTRO';
        instruction.style.marginTop = '10px';
        container.appendChild(instruction);

        this.gyroHandler = (event) => {
            // Beta: -180 a 180 (frente/atras). Queremos que 0 sea el centro.
            // Gamma: -90 a 90 (izq/der). Queremos que 0 sea el centro.

            let x = event.gamma || 0; // Izq/Der
            let y = event.beta || 0;  // Arriba/Abajo

            // Limitar valores para que no se salga del círculo visualmente (aprox)
            if (x > 45) x = 45;
            if (x < -45) x = -45;
            if (y > 45) y = 45;
            if (y < -45) y = -45;

            // Mapear a porcentajes (50% es centro)
            // 45 grados -> 100% (borde derecho)
            // -45 grados -> 0% (borde izquierdo)
            const leftPos = 50 + (x / 45 * 50);
            const topPos = 50 + (y / 45 * 50);

            bubble.style.left = `${leftPos}%`;
            bubble.style.top = `${topPos}%`;

            // Verificar condición de victoria (estar cerca del centro)
            if (Math.abs(x) < 5 && Math.abs(y) < 5) {
                target.style.borderColor = '#00ff41'; // Verde
                // Podríamos añadir un contador para ganar
            } else {
                target.style.borderColor = '#ff3333'; // Rojo
            }
        };

        window.addEventListener('deviceorientation', this.gyroHandler);
    }

    stopLevelGame() {
        if (this.gyroHandler) {
            window.removeEventListener('deviceorientation', this.gyroHandler);
            this.gyroHandler = null;
        }
    }
}
