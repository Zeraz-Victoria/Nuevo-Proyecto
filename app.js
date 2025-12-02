// Estado Global
const state = {
    gameState: 'intro', // intro, mission1, mission2, mission3, victory
    score: 0,
    playerName: '',

    // Misión 1
    phValue: 5.0,
    tempInput: '',
    photoTaken: false,

    // Misión 2
    foodCalc: '',
    feedError: false,

    // Misión 3
    diagnosis: '',
    recording: false,
    audioSaved: false
};

// --- RENDERIZADO ---

function render() {
    const app = document.getElementById('app');
    app.innerHTML = ''; // Limpiar

    // Header (excepto en intro)
    if (state.gameState !== 'intro') {
        app.innerHTML += `
            <div class="w-full bg-slate-900 p-4 flex justify-between items-center border-b-2 border-cyan-500 shadow-lg shadow-cyan-500/20 sticky top-0 z-50">
                <div class="flex items-center gap-2">
                    <i data-lucide="activity" class="text-cyan-400 animate-pulse w-5 h-5"></i>
                    <span class="text-cyan-100 font-bold tracking-wider">N.E.M.O. SYSTEM</span>
                </div>
                <div class="text-yellow-400 font-mono font-bold">PTS: ${state.score}</div>
            </div>
        `;
    }

    // Vistas
    if (state.gameState === 'intro') renderIntro(app);
    else if (state.gameState === 'mission1') renderMission1(app);
    else if (state.gameState === 'mission2') renderMission2(app);
    else if (state.gameState === 'mission3') renderMission3(app);
    else if (state.gameState === 'victory') renderVictory(app);

    // Inicializar Iconos
    lucide.createIcons();
}

function renderIntro(container) {
    container.innerHTML += `
        <div class="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center space-y-6 bg-slate-900 text-white animate-fade-in flex-1">
            <div class="w-24 h-24 bg-cyan-900 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                <i data-lucide="fish" class="text-cyan-400 w-12 h-12"></i>
            </div>
            <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                OPERACIÓN<br/>ACUA-VIDA
            </h1>
            <p class="text-slate-300">
                Año 2085. El último Domo Acuapónico está fallando.
                <br/><br/>
                Cadete, necesitamos tus cálculos manuales y diagnósticos para salvar a las Tilapias.
            </p>
            
            <input 
                type="text" 
                id="input-name"
                placeholder="Ingresa tu nombre, Cadete" 
                class="w-full max-w-xs p-3 rounded bg-slate-800 border border-slate-600 text-center text-white focus:border-cyan-500 outline-none"
                value="${state.playerName}"
            />

            <button 
                id="btn-start"
                class="w-full max-w-xs bg-gradient-to-r from-cyan-600 to-blue-600 py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                ${!state.playerName.trim() ? 'disabled' : ''}
            >
                INICIAR MISIÓN
            </button>
            <p class="text-xs text-slate-500 mt-8">Versión Ligera v1.0 • No requiere internet continuo</p>
        </div>
    `;

    // Event Listeners
    document.getElementById('input-name').addEventListener('input', (e) => {
        state.playerName = e.target.value;
        render(); // Re-render para habilitar botón
        // Mantener foco
        setTimeout(() => document.getElementById('input-name').focus(), 0);
    });

    document.getElementById('btn-start').addEventListener('click', () => {
        if (state.playerName.trim()) {
            state.gameState = 'mission1';
            render();
        }
    });
}

function renderMission1(container) {
    container.innerHTML += `
        <div class="p-6 space-y-6 pb-20 animate-fade-in">
            <h2 class="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                <i data-lucide="droplet"></i> Misión 1: Entorno
            </h2>
            <p class="text-slate-300 text-sm">
                Los sensores están descalibrados. Necesitamos restablecer el pH y la temperatura ideal para la Tilapia.
            </p>

            <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 my-4 rounded-r shadow-sm">
                <div class="flex items-center gap-2 mb-2 font-bold">
                    <i data-lucide="book-open" class="w-4 h-4"></i>
                    <span>ACCIÓN EN LIBRETA:</span>
                </div>
                <p class="text-sm">
                    1. Dibuja un termómetro marcando 28°C.<br/>
                    2. Dibuja una escala de pH y marca el 7 (Neutro).<br/>
                    3. Sube una foto de tu dibujo.
                </p>
            </div>

            <!-- Simulación de Cámara -->
            <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <label class="flex flex-col items-center gap-2 cursor-pointer">
                    <div class="w-16 h-16 rounded-full flex items-center justify-center ${state.photoTaken ? 'bg-green-600' : 'bg-slate-700'}">
                        <i data-lucide="camera" class="text-white w-6 h-6"></i>
                    </div>
                    <span class="text-xs text-slate-400">${state.photoTaken ? "Evidencia Guardada" : "Tomar Foto de Libreta"}</span>
                    <input type="file" accept="image/*" class="hidden" id="input-photo" />
                </label>
            </div>

            <!-- Control Digital de pH -->
            <div class="space-y-2">
                <label class="text-white text-sm font-bold flex justify-between">
                    <span>Calibrar pH Digital:</span>
                    <span class="${state.phValue >= 6.5 && state.phValue <= 7.5 ? "text-green-400" : "text-red-400"}">${state.phValue.toFixed(1)}</span>
                </label>
                <input 
                    type="range" min="4" max="9" step="0.1" 
                    value="${state.phValue}" 
                    id="input-ph"
                    class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div class="flex justify-between text-xs text-slate-500 font-mono">
                    <span>Ácido (4)</span>
                    <span>Neutro (7)</span>
                    <span>Alcalino (9)</span>
                </div>
            </div>

            <!-- Input de Temperatura -->
            <div class="space-y-2">
                <label class="text-white text-sm font-bold">Ingresar Temperatura Objetivo (°C):</label>
                <input 
                    type="number" 
                    id="input-temp"
                    placeholder="Ej: 20" 
                    value="${state.tempInput}"
                    class="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white focus:border-cyan-500 outline-none"
                />
            </div>

            <button id="btn-check-m1" class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg transition-colors">
                ESTABILIZAR SISTEMA
            </button>
        </div>
    `;

    // Listeners
    document.getElementById('input-photo').addEventListener('change', () => {
        state.photoTaken = true;
        render();
    });

    document.getElementById('input-ph').addEventListener('input', (e) => {
        state.phValue = parseFloat(e.target.value);
        // Actualizar solo el texto del pH para no perder foco del slider
        // Pero por simplicidad, re-renderizamos todo (puede cortar el drag)
        // Mejor: Actualizar DOM directo
        document.querySelector('span.text-red-400, span.text-green-400').innerText = state.phValue.toFixed(1);
        // No llamamos render() aquí para performance de slider
    });

    document.getElementById('input-temp').addEventListener('input', (e) => {
        state.tempInput = e.target.value;
    });

    document.getElementById('btn-check-m1').addEventListener('click', () => {
        const isPhGood = state.phValue >= 6.5 && state.phValue <= 7.5;
        const isTempGood = state.tempInput === '28';

        if (isPhGood && isTempGood && state.photoTaken) {
            state.score += 100;
            state.gameState = 'mission2';
            render();
        } else {
            alert("¡Error en los parámetros! Revisa el rango ideal de la Tilapia (pH 7, 28°C) y asegúrate de tomar la evidencia.");
        }
    });
}

function renderMission2(container) {
    const totalFish = 50;
    const weightPerFish = 200;
    const percentage = 3;

    container.innerHTML += `
        <div class="p-6 space-y-6 pb-20 animate-fade-in">
            <h2 class="text-2xl font-bold text-green-400 flex items-center gap-2">
                <i data-lucide="fish"></i> Misión 2: Alimentación
            </h2>
            <p class="text-slate-300 text-sm">
                Los peces necesitan comer, pero no debemos desperdiciar. Calcula la ración exacta.
            </p>

            <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-sm text-green-300">
                <p>DATOS DEL SENSOR:</p>
                <ul class="list-disc list-inside mt-2 text-slate-300">
                    <li>Población: ${totalFish} peces</li>
                    <li>Peso promedio: ${weightPerFish}g c/u</li>
                    <li>Tasa alimentación: ${percentage}% biomasa</li>
                </ul>
            </div>

            <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 my-4 rounded-r shadow-sm">
                <div class="flex items-center gap-2 mb-2 font-bold">
                    <i data-lucide="book-open" class="w-4 h-4"></i>
                    <span>ACCIÓN EN LIBRETA:</span>
                </div>
                <p class="text-sm">
                    1. Calcula la Biomasa Total (Peces x Peso).<br/>
                    2. Calcula el ${percentage}% de esa biomasa.<br/>
                    3. Escribe la fórmula completa en tu libreta.
                </p>
            </div>

            <div class="space-y-2">
                <label class="text-white text-sm font-bold flex items-center gap-2">
                    <i data-lucide="calculator" class="w-4 h-4"></i> Gramos de alimento requeridos:
                </label>
                <input 
                    type="number" 
                    id="input-food"
                    placeholder="Resultado en gramos" 
                    value="${state.foodCalc}"
                    class="w-full p-3 bg-slate-800 border ${state.feedError ? 'border-red-500' : 'border-slate-600'} rounded text-white focus:border-green-500 outline-none"
                />
                ${state.feedError ? '<p class="text-red-400 text-xs">Cálculo incorrecto. Intenta de nuevo.</p>' : ''}
            </div>

            <button id="btn-check-m2" class="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg transition-colors">
                DISPENSAR ALIMENTO
            </button>
        </div>
    `;

    document.getElementById('input-food').addEventListener('input', (e) => {
        state.foodCalc = e.target.value;
        state.feedError = false;
    });

    document.getElementById('btn-check-m2').addEventListener('click', () => {
        if (state.foodCalc === '300') {
            state.score += 150;
            state.gameState = 'mission3';
            render();
        } else {
            state.feedError = true;
            render();
        }
    });
}

function renderMission3(container) {
    container.innerHTML += `
        <div class="p-6 space-y-6 pb-20 animate-fade-in">
            <h2 class="text-2xl font-bold text-red-400 flex items-center gap-2">
                <i data-lucide="alert-triangle"></i> Misión 3: Diagnóstico
            </h2>
            
            <div class="relative w-full h-48 bg-slate-800 rounded-xl overflow-hidden border border-red-900 group">
                <div class="absolute inset-0 bg-blue-900/30 flex items-center justify-center">
                    <i data-lucide="fish" class="text-slate-300 opacity-50 w-20 h-20"></i>
                    <div class="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white] -translate-x-4 -translate-y-2"></div>
                    <div class="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white] translate-x-2 translate-y-4"></div>
                    <div class="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white] translate-x-6 -translate-y-6"></div>
                </div>
                <div class="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">ALERTA BIOLÓGICA</div>
            </div>

            <p class="text-slate-300 text-sm">
                El sujeto 04 presenta letargo y manchas pequeñas en las escamas. Se frota contra las rocas.
            </p>

            <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 my-4 rounded-r shadow-sm">
                <div class="flex items-center gap-2 mb-2 font-bold">
                    <i data-lucide="book-open" class="w-4 h-4"></i>
                    <span>ACCIÓN EN LIBRETA:</span>
                </div>
                <p class="text-sm">
                    1. Identifica la enfermedad común.<br/>
                    2. Escribe en tu libreta el tratamiento (Temperatura + Sal).<br/>
                    3. Graba un reporte de voz para el Capitán.
                </p>
            </div>

            <div class="space-y-4">
                <input 
                    type="text" 
                    id="input-diagnosis"
                    placeholder="Nombre de la enfermedad..." 
                    value="${state.diagnosis}"
                    class="w-full p-3 bg-slate-800 border border-slate-600 rounded text-white outline-none"
                />

                <button 
                    id="btn-record"
                    ${state.audioSaved ? 'disabled' : ''}
                    class="w-full py-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${state.audioSaved
            ? 'border-green-500 text-green-400 bg-green-900/20'
            : state.recording
                ? 'border-red-500 text-red-500 bg-red-900/20 animate-pulse'
                : 'border-slate-600 text-slate-400 hover:bg-slate-800'
        }"
                >
                    <i data-lucide="${state.audioSaved ? 'check-circle' : 'mic'}" class="w-5 h-5"></i>
                    ${state.audioSaved ? "Reporte Guardado" : state.recording ? "Grabando..." : "Grabar Diagnóstico (Mantener 3s)"}
                </button>
            </div>

            <button id="btn-check-m3" class="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg transition-colors mt-4">
                ADMINISTRAR CURA
            </button>
        </div>
    `;

    document.getElementById('input-diagnosis').addEventListener('input', (e) => {
        state.diagnosis = e.target.value;
    });

    document.getElementById('btn-record').addEventListener('click', () => {
        if (!state.audioSaved && !state.recording) {
            state.recording = true;
            render(); // Mostrar estado grabando
            setTimeout(() => {
                state.recording = false;
                state.audioSaved = true;
                render(); // Mostrar estado guardado
            }, 3000);
        }
    });

    document.getElementById('btn-check-m3').addEventListener('click', () => {
        const diagnosisClean = state.diagnosis.toLowerCase();
        if ((diagnosisClean.includes('ich') || diagnosisClean.includes('punto') || diagnosisClean.includes('blanco')) && state.audioSaved) {
            state.score += 200;
            state.gameState = 'victory';
            render();
        } else {
            alert("Debes identificar la enfermedad (pista: puntos blancos) y grabar tu reporte de voz.");
        }
    });
}

function renderVictory(container) {
    container.innerHTML += `
        <div class="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center space-y-6 bg-slate-900 text-white animate-fade-in flex-1">
            <div class="w-32 h-32 bg-yellow-500/20 rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.5)]">
                <i data-lucide="activity" class="text-yellow-400 w-16 h-16"></i>
            </div>
            
            <h1 class="text-4xl font-black text-yellow-400">¡MISIÓN CUMPLIDA!</h1>
            
            <div class="bg-slate-800 p-6 rounded-xl w-full max-w-sm border border-slate-700">
                <p class="text-slate-400 text-sm mb-2">CADETE BIO-INGENIERO</p>
                <p class="text-2xl font-bold text-white">${state.playerName}</p>
                <div class="h-px w-full bg-slate-600 my-4"></div>
                <div class="flex justify-between items-center">
                    <span class="text-slate-400">Puntaje Final:</span>
                    <span class="text-2xl font-mono text-cyan-400">${state.score}</span>
                </div>
            </div>

            <div class="bg-blue-900/30 p-4 rounded text-sm text-blue-200 border border-blue-800">
                <p>El Domo Acuático 7 está estable. Las Tilapias han sobrevivido gracias a tu intervención.</p>
            </div>

            <p class="text-xs text-slate-500 mt-8">Muestra esta pantalla y tu libreta al profesor para recibir tu insignia real.</p>
            
            <button id="btn-reset" class="text-slate-400 underline text-sm">Jugar de nuevo</button>
        </div>
    `;

    document.getElementById('btn-reset').addEventListener('click', () => {
        location.reload();
    });
}

// Iniciar
render();
