export default class NarrativeModule {
    constructor() {
        this.dialogues = {
            'intro': [
                { char: 'SYSTEM', text: 'INICIANDO ENLACE TEMPORAL...', delay: 1000 },
                { char: 'SYSTEM', text: 'AGENTE DETECTADO. BIENVENIDO A LA AGENCIA DE EQUILIBRIO.', delay: 1000 },
                { char: 'NEO', text: '¡Agente! Menos mal que estás aquí. El año 2050 está colapsando.', delay: 2000 },
                { char: 'NEO', text: 'Nuestros sistemas acuapónicos son perfectos... en teoría. Pero algo falta. Necesitamos datos del pasado.', delay: 3000 },
                { char: 'CITLALI', text: '... (Sonido de agua) ... ¿Quién habla en el viento?', delay: 2000 },
                { char: 'SYSTEM', text: 'ENLACE ESTABLECIDO: AÑO 1350 - XOCHIMILCO.', delay: 1000 }
            ],
            'past-1': [
                { char: 'CITLALI', text: 'Ah, eres tú, viajero. Veo que vistes ropas extrañas.', delay: 2000 },
                { char: 'CITLALI', text: 'Aquí en la chinampa, nada se desperdicia. El lodo del fondo nutre al maíz.', delay: 3000 },
                {
                    char: 'CITLALI', text: 'Dime, en tu tiempo, ¿qué hacen con lo que sobra?', delay: 2000, options: [
                        { text: 'Lo tiramos a la basura', next: 'past-1-bad' },
                        { text: 'Intentamos reciclarlo', next: 'past-1-good' }
                    ]
                }
            ],
            'past-1-bad': [
                { char: 'CITLALI', text: '¡Qué desperdicio! La tierra llora cuando no le devuelves lo que te dio.', delay: 3000 },
                { char: 'CITLALI', text: 'Debes aprender a cerrar el ciclo. Ayúdame a sacar lodo.', delay: 2000, action: 'start-mission-1' }
            ],
            'past-1-good': [
                { char: 'CITLALI', text: 'Eso es sabio. El ciclo debe cerrarse siempre. Como la serpiente que se muerde la cola.', delay: 3000 },
                { char: 'CITLALI', text: 'Ven, te enseñaré cómo alimentamos la tierra aquí.', delay: 2000, action: 'start-mission-1' }
            ],
            'future-1': [
                { char: 'NEO', text: '¡Increíble! Los datos que enviaste del pasado tienen sentido.', delay: 2000 },
                { char: 'NEO', text: 'Mis sensores de amoníaco están en rojo. Las bacterias no están procesando los desechos.', delay: 3000 },
                { char: 'NEO', text: 'Según la Abuela Citlali, el "lodo" es oro. Aquí lo filtramos y lo tiramos.', delay: 3000 },
                {
                    char: 'NEO', text: '¿Qué deberíamos hacer?', delay: 2000, options: [
                        { text: 'Usar más químicos', next: 'future-1-bad' },
                        { text: 'Reintegrar los desechos', next: 'future-1-good' }
                    ]
                }
            ],
            'future-1-bad': [
                { char: 'NEO', text: 'No... eso solo desequilibra más el pH. Piensa como Citlali.', delay: 2000, action: 'retry-future-1' }
            ],
            'future-1-good': [
                { char: 'NEO', text: '¡Exacto! Bio-mineralización. Vamos a recalibrar el biofiltro.', delay: 2000, action: 'start-mission-2' }
            ]
        };
    }

    getDialogue(id) {
        return this.dialogues[id];
    }
}
