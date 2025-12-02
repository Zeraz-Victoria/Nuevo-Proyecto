export default class QuizModule {
    constructor() {
        this.quizzes = {
            'quiz-chem': {
                title: 'EVALUACIÓN: QUÍMICA',
                questions: [
                    { q: '¿Cuál es el rango de pH ideal para la mayoría de sistemas acuapónicos?', options: ['5.0 - 6.0', '6.8 - 7.2', '8.0 - 9.0'], correct: 1 },
                    { q: '¿Qué compuesto excretan los peces que es tóxico?', options: ['Nitrato', 'Oxígeno', 'Amoníaco'], correct: 2 },
                    { q: 'Si el pH es muy alto (>7.5), ¿qué nutriente dejan de absorber las plantas?', options: ['Hierro', 'Calcio', 'Potasio'], correct: 0 }
                ],
                xpReward: 50
            },
            'quiz-bio': {
                title: 'EVALUACIÓN: BIOLOGÍA',
                questions: [
                    { q: '¿Qué indican unas branquias de color rojo brillante?', options: ['Enfermedad grave', 'Salud óptima', 'Falta de oxígeno'], correct: 1 },
                    { q: '¿Qué enfermedad se manifiesta como puntos blancos?', options: ['Ich', 'Hongos', 'Aletas rotas'], correct: 0 },
                    { q: '¿Para qué sirve la línea lateral de los peces?', options: ['Respirar', 'Detectar vibraciones', 'Comer'], correct: 1 }
                ],
                xpReward: 50
            },
            'quiz-feeding': {
                title: 'EVALUACIÓN: ALIMENTACIÓN',
                questions: [
                    { q: '¿Cuál es la tasa de alimentación diaria recomendada?', options: ['10%', '1-3%', '5-8%'], correct: 1 },
                    { q: '¿Qué pasa si sobrealimentas a los peces?', options: ['Crecen más rápido', 'Sube el amoníaco', 'El agua se limpia'], correct: 1 },
                    { q: 'Si tienes 10kg de biomasa, ¿cuánto alimento (2%) das al día?', options: ['200g', '20g', '2kg'], correct: 0 }
                ],
                xpReward: 50
            }
        };
    }

    startQuiz(quizId, container, onComplete) {
        const quiz = this.quizzes[quizId];
        let currentQ = 0;
        let score = 0;

        container.innerHTML = '';
        const title = document.createElement('h3');
        title.innerText = quiz.title;
        container.appendChild(title);

        const qContainer = document.createElement('div');
        qContainer.className = 'quiz-container';
        container.appendChild(qContainer);

        const showQuestion = () => {
            if (currentQ >= quiz.questions.length) {
                // Fin del quiz
                qContainer.innerHTML = `
                    <h4>RESULTADOS</h4>
                    <p>Aciertos: ${score} / ${quiz.questions.length}</p>
                `;
                const btn = document.createElement('button');
                btn.className = 'cyber-button small';
                btn.innerText = 'FINALIZAR';
                btn.onclick = () => onComplete(score >= 2); // Aprobar con 2/3
                qContainer.appendChild(btn);
                return;
            }

            const q = quiz.questions[currentQ];
            qContainer.innerHTML = `<p class="quiz-question">${currentQ + 1}. ${q.q}</p>`;

            const optsDiv = document.createElement('div');
            optsDiv.className = 'quiz-options';

            q.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.innerText = opt;
                btn.onclick = () => {
                    if (idx === q.correct) score++;
                    currentQ++;
                    showQuestion();
                };
                optsDiv.appendChild(btn);
            });
            qContainer.appendChild(optsDiv);
        };

        showQuestion();
    }
}
