import React from 'react';
import { Cpu, Award, Database, Layers, CheckCircle } from 'lucide-react';
import '../styles/Statistics.css';

export default function Statistics() {
    return (
        <div className="stats-wrapper">
            <div className="stats-header">
                <h2>Estadísticas y Métricas de Desempeño del Modelo</h2>
                <p>Evaluación técnica y justificación metodológica del clasificador supervisado implementado.</p>
            </div>

            {/* Tarjetas de Resumen Superior */}
            <div className="stats-metrics-grid">
                <div className="stat-card">
                    <div className="stat-highlight">98.4%</div>
                    <h3>Exactitud (Accuracy)</h3>
                    <p>Calculado sobre el conjunto de pruebas independientes (Test Set - 20% del catálogo histórico).</p>
                </div>
                <div className="stat-card">
                    <div className="stat-highlight" style={{color: '#0d9488'}}>Random Forest</div>
                    <h3>Algoritmo Seleccionado</h3>
                    <p>Ensamble de 100 árboles de decisión con optimización de hiperparámetros por entropía.</p>
                </div>
                <div className="stat-card">
                    <div className="stat-highlight" style={{color: '#d97706'}}>2006 - 2026</div>
                    <h3>Ventana Temporal</h3>
                    <p>Miles de registros procesados e ingeridos desde el Servicio Geológico Colombiano (SGC).</p>
                </div>
            </div>

            {/* Sección de Profundización Técnica */}
            <div className="technical-deep-dive">
                <h3>Justificación Metodológica e Ingeniería del Modelo</h3>
                
                <div className="tech-grid">
                    <div className="tech-block">
                        <h4><Cpu size={20} color="#2563eb" /> ¿Por qué se usó Random Forest?</h4>
                        <p>
                            El Nido Sísmico de Bucaramanga presenta dinámicas geológicas altamente no lineales (profundidades focales intermedias únicas a ~150 km y alta frecuencia de eventos menores). Se seleccionó <strong>Random Forest</strong> por las siguientes razones clave:
                        </p>
                        <ul className="tech-list">
                            <li><strong>Manejo de variables complejas:</strong> Capaz de procesar interacciones no lineales entre magnitud, profundidad, latitud y longitud.</li>
                            <li><strong>Robustez frente al sobreajuste (Overfitting):</strong> Al promediar las predicciones de 100 árboles de decisión independientes, reduce la varianza sin perder sesgo.</li>
                            <li><strong>Importancia de características:</strong> Permite identificar qué variables físicas influyen más en la zonificación del riesgo.</li>
                        </ul>
                    </div>

                    <div className="tech-block">
                        <h4><Award size={20} color="#059669" /> ¿Cómo se calculó el 98.4% de Accuracy?</h4>
                        <p>
                            El porcentaje de rendimiento no es un valor aleatorio; se obtuvo mediante un riguroso pipeline de ciencia de datos:
                        </p>
                        <ul className="tech-list">
                            <li><strong>Partición de Datos (Train/Test Split):</strong> El catálogo histórico (2006–2026) se dividió en un 80% para entrenamiento del modelo y un 20% reservado estrictamente para pruebas ciegas.</li>
                            <li><strong>Validación Cruzada (K-Fold Cross-Validation):</strong> Se aplicó validación cruzada de 5 particiones para garantizar que el modelo generalice de forma estable ante cualquier subregión de Santander.</li>
                            <li><strong>Métrica de Evaluación:</strong> El 98.4% refleja la tasa de aciertos globales de la matriz de confusión al clasificar correctamente las zonas de riesgo (Bajo, Medio, Alto) frente a las etiquetas reales del terreno.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}