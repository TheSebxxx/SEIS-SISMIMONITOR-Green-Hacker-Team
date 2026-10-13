import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/PredictionsMap.css';

// Componente auxiliar para recentrar el mapa cuando cambian los filtros
function MapRecenter({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

export default function PredictionsMap() {
    const [zonas, setZonas] = useState([]);
    const [selectedRiesgo, setSelectedRiesgo] = useState('TODOS');
    const [selectedZona, setSelectedZona] = useState('TODOS');
    const [mapCenter, setMapCenter] = useState([6.8, -73.12]); // Centrado en Santander/Bucaramanga

    useEffect(() => {
        fetch('http://localhost:5000/api/clasificaciones')
            .then(res => res.json())
            .then(data => setZonas(data))
            .catch(err => console.error("Error al cargar clasificaciones ML:", err));
    }, []);

    const getRiesgoColor = (nivel) => {
        if (nivel === 'ALTO') return '#dc2626';
        if (nivel === 'MEDIO') return '#f59e0b';
        return '#10b981';
    };

    const getBadgeClass = (nivel) => {
        if (nivel === 'ALTO') return 'alto';
        if (nivel === 'MEDIO') return 'medio';
        return 'bajo';
    };

    // Filtrado de zonas
    const filteredZonas = zonas.filter(z => {
        const matchRiesgo = selectedRiesgo === 'TODOS' || z.nivel_riesgo === selectedRiesgo;
        const matchZona = selectedZona === 'TODOS' || z.zona_nombre === selectedZona;
        return matchRiesgo && matchZona;
    });

    // Actualizar centro del mapa si hay zonas filtradas
    useEffect(() => {
        if (filteredZonas.length > 0 && selectedZona !== 'TODOS') {
            const zEncontrada = filteredZonas.find(z => z.zona_nombre === selectedZona);
            if (zEncontrada) {
                setMapCenter([zEncontrada.latitud_centro, zEncontrada.longitud_centro]);
            }
        }
    }, [selectedZona, filteredZonas]);

    return (
        <div className="map-view-wrapper">
            <div className="map-header">
                <h2>Predicciones de Riesgo Sísmico (Machine Learning)</h2>
                <p>Clasificación territorial supervisada por zonas y municipios</p>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="filters-bar">
                <div className="filter-group">
                    <label>Nivel de Riesgo (ML)</label>
                    <select value={selectedRiesgo} onChange={e => setSelectedRiesgo(e.target.value)}>
                        <option value="TODOS">Todos los Riesgos</option>
                        <option value="BAJO">Bajo</option>
                        <option value="MEDIO">Medio</option>
                        <option value="ALTO">Alto</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Zona / Municipio</label>
                    <select value={selectedZona} onChange={e => setSelectedZona(e.target.value)}>
                        <option value="TODOS">Todas las Zonas</option>
                        {zonas.map((z, idx) => (
                            <option key={idx} value={z.zona_nombre}>{z.zona_nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="map-legend">
                <span><i style={{background: '#10b981'}}></i> Riesgo Bajo</span>
                <span><i style={{background: '#f59e0b'}}></i> Riesgo Medio</span>
                <span><i style={{background: '#dc2626'}}></i> Riesgo Alto</span>
                <span style={{marginLeft: 'auto', fontWeight: '600', color: '#2563eb'}}>
                    Zonas evaluadas: {filteredZonas.length}
                </span>
            </div>

            {/* CONTENEDOR DEL MAPA */}
            <div className="leaflet-box">
                <MapContainer center={mapCenter} zoom={9} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <MapRecenter center={mapCenter} />
                    
                    {filteredZonas.map((zona, index) => (
                        <CircleMarker
                            key={index}
                            center={[zona.latitud_centro, zona.longitud_centro]}
                            radius={Math.max(10, (zona.total_sismos || 10) / 4)}
                            pathOptions={{
                                fillColor: getRiesgoColor(zona.nivel_riesgo),
                                color: getRiesgoColor(zona.nivel_riesgo),
                                weight: 2,
                                fillOpacity: 0.75
                            }}
                        >
                            <Popup>
                                <strong>Zona/Municipio:</strong> {zona.zona_nombre}<br/>
                                <strong>Nivel de Riesgo (ML):</strong> {zona.nivel_riesgo}<br/>
                                <strong>Confianza:</strong> {zona.score_confianza ? (zona.score_confianza * 100).toFixed(1) + '%' : 'N/D'}<br/>
                                <strong>Total Sismos:</strong> {zona.total_sismos}<br/>
                                <strong>Magnitud Máxima:</strong> {zona.magnitud_maxima}
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>

            {/* TABLA DE CLASIFICACIONES DEBAJO DEL MAPA */}
            <div className="table-section-box">
                <h3>Detalle de Clasificación por Zonas (Machine Learning)</h3>
                <p>Resultados del modelo supervisado para la evaluación del riesgo territorial</p>
                
                <div className="table-responsive">
                    <table className="seismic-table">
                        <thead>
                            <tr>
                                <th>Zona / Municipio</th>
                                <th>Nivel de Riesgo</th>
                                <th>Score Confianza</th>
                                <th>Total Sismos</th>
                                <th>Magnitud Máxima</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredZonas.length > 0 ? (
                                filteredZonas.map((z, idx) => (
                                    <tr key={idx}>
                                        <td><strong>{z.zona_nombre}</strong></td>
                                        <td>
                                            <span className={`badge-riesgo ${getBadgeClass(z.nivel_riesgo)}`}>
                                                {z.nivel_riesgo}
                                            </span>
                                        </td>
                                        <td>{z.score_confianza ? (z.score_confianza * 100).toFixed(1) + '%' : 'N/D'}</td>
                                        <td>{z.total_sismos}</td>
                                        <td>{z.magnitud_maxima}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                                        No se encontraron zonas con los filtros seleccionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}