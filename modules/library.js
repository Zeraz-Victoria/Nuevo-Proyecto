export default class LibraryModule {
    constructor() {
        this.content = {
            'chem-intro': {
                title: 'QUÍMICA DEL AGUA 101',
                text: `
                    <h3>EL EQUILIBRIO INVISIBLE</h3>
                    <p>El éxito de la acuaponía depende de la química del agua. Los peces excretan amoníaco, que es tóxico. Las bacterias lo convierten en nitritos y luego en nitratos, que las plantas absorben.</p>
                    
                    <h4>PARÁMETROS CRÍTICOS:</h4>
                    <ul>
                        <li><strong>pH (Potencial de Hidrógeno):</strong> Mide la acidez.
                            <br>Rango ideal: <strong>6.8 - 7.2</strong>.
                            <br>Si es < 6.0: Las bacterias mueren.
                            <br>Si es > 7.5: Las plantas no absorben hierro.
                        </li>
                        <li><strong>Temperatura:</strong> Afecta el metabolismo.
                            <br>Tilapia: <strong>22°C - 30°C</strong>.
                            <br>Trucha: <strong>10°C - 18°C</strong>.
                        </li>
                        <li><strong>Oxígeno Disuelto (OD):</strong> Vital para peces y raíces.
                            <br>Mínimo: <strong>5 mg/L</strong>.
                        </li>
                    </ul>
                    <p class="highlight">MISIÓN: Mantener estos valores estables es tu prioridad número uno.</p>
                `
            },
            'fish-bio': {
                title: 'BIOLOGÍA DE LOS PECES',
                text: `
                    <h3>CONOCE A TUS HABITANTES</h3>
                    <p>Los peces no son solo máquinas de producir amoníaco. Son seres vivos complejos que requieren cuidados específicos.</p>

                    <h4>ANATOMÍA BÁSICA:</h4>
                    <ul>
                        <li><strong>Branquias:</strong> Para respirar. Si están rojas brillantes, están sanas. Si están pálidas o marrones, hay problemas.</li>
                        <li><strong>Línea Lateral:</strong> Órgano sensorial para detectar vibraciones.</li>
                        <li><strong>Aletas:</strong> Deben estar íntegras. Aletas deshilachadas indican infección bacteriana o agresión.</li>
                    </ul>

                    <h4>ENFERMEDADES COMUNES:</h4>
                    <ul>
                        <li><strong>Ich (Punto Blanco):</strong> Parásito visible como puntos de sal. Causa: Cambios bruscos de temperatura.</li>
                        <li><strong>Hongos:</strong> Manchas algodonosas. Causa: Mala calidad del agua o heridas.</li>
                    </ul>
                `
            },
            'feeding': {
                title: 'ALIMENTACIÓN Y CÁLCULOS',
                text: `
                    <h3>LA MATEMÁTICA DEL CRECIMIENTO</h3>
                    <p>Sobrealimentar es peor que subalimentar. El alimento no comido se pudre y genera picos de amoníaco letales.</p>

                    <h4>REGLAS DE ORO:</h4>
                    <ol>
                        <li><strong>Tasa de Alimentación:</strong> Generalmente 1-3% del peso corporal total (Biomasa) por día.</li>
                        <li><strong>Frecuencia:</strong> Dividir la dosis en 2-3 tomas diarias.</li>
                        <li><strong>Observación:</strong> Deben comer todo en 5 minutos.</li>
                    </ol>

                    <h4>EJEMPLO DE CÁLCULO:</h4>
                    <p>Si tienes <strong>100 peces</strong> y cada uno pesa <strong>50 gramos</strong>:</p>
                    <p>Biomasa Total = 100 * 50g = 5,000g (5 kg).</p>
                    <p>Alimento (2%) = 5,000g * 0.02 = <strong>100 gramos al día</strong>.</p>
                `
            }
        };
    }

    getContent(id) {
        return this.content[id];
    }
}
