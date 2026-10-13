import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, MapPin, TrendingUp } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import '../styles/Dashboard.css';

export default function Dashboard() {
    const [sismos, setSismos] = useState([]);
    const [municipioData, setMunicipioData] = useState([]);
    const [riesgoData, setRiesgoData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/sismos')
            .then(res => res.json())
            .then(data => {
                setSismos(data);

                // 1. Top Municipios de Santander
                const conteoMuni = {};
                data.forEach(s => {
                    const muni = s.municipio || 'OTRO';
                    conteoMuni[muni] = (conteoMuni[muni] || 0) + 1;
                });
                const muniFormatted = Object.keys(conteoMuni).map(muni => ({
                    municipio: muni,
                    total: conteoMuni[muni]
                })).sort((a, b) => b.total - a.total).slice(0, 6);
                setMunicipioData(muniFormatted);

                // 2. Niveles de Riesgo
                let bajo = 0, medio = 0, alto = 0;
                data.forEach(s => {
                    if (s.magnitud >= 4.5) alto++;
                    else if (s.magnitud >= 3.0) medio++;
                    else bajo++;
                });
                setRiesgoData([
                    { name: 'Bajo (<3.0)', value: bajo, color: '#10b981' },
                    { name: 'Medio (3.0-4.4)', value: medio, color: '#f59e0b' },
                    { name: 'Alto (>=4.5)', value: alto, color: '#dc2626' }
                ]);
            })
            .catch(err => console.error("Error al cargar datos del dashboard:", err));
    }, []);

    const totalSismos = sismos.length;
    const maxMagnitud = sismos.length > 0 ? Math.max(...sismos.map(s => s.magnitud || 0)).toFixed(1) : 0;
    const sismosAltos = sismos.filter(s => s.magnitud >= 4.5).length;

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-header">
                <h2>Dashboard — Nido Sísmico de Santander</h2>
                <p>Monitoreo analítico enfocado en Bucaramanga, Los Santos y municipios de influencia.</p>
            </div>

            {/* Tarjetas de Métricas */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-icon blue"><Activity size={24} /></div>
                    <div>
                        <span className="metric-title">Sismos en Santander</span>
                        <h3 className="metric-value">{totalSismos}</h3>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon red"><ShieldAlert size={24} /></div>
                    <div>
                        <span className="metric-title">Riesgo Alto (&ge; 4.5)</span>
                        <h3 className="metric-value">{sismosAltos}</h3>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon orange"><TrendingUp size={24} /></div>
                    <div>
                        <span className="metric-title">Magnitud Máxima</span>
                        <h3 className="metric-value">{maxMagnitud}</h3>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon green"><MapPin size={24} /></div>
                    <div>
                        <span className="metric-title">Epicentro Clave</span>
                        <h3 className="metric-value">Los Santos</h3>
                    </div>
                </div>
            </div>

            {/* Grid de Gráficas: Municipios y Riesgo */}
            <div className="charts-row-grid">
                <div className="chart-section-box">
                    <div className="chart-header">
                        <h3>Top Municipios Sísmicos en Santander</h3>
                        <p>Concentración de eventos por localidad</p>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={municipioData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="municipio" stroke="#64748b" fontSize={11} />
                                <YAxis stroke="#64748b" fontSize={11} />
                                <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-section-box">
                    <div className="chart-header">
                        <h3>Niveles de Riesgo en Santander</h3>
                        <p>Proporción según magnitud</p>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={riesgoData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {riesgoData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}