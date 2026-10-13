import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/SeismicMap.css';

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

export default function SeismicMap() {
    const [sismos, setSismos] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    
    // Estados de filtros
    const [selectedDepto, setSelectedDepto] = useState('TODOS');
    const [selectedMuni, setSelectedMuni] = useState('TODOS');
    const [selectedAnio, setSelectedAnio] = useState('TODOS');
    const [selectedMes, setSelectedMes] = useState('TODOS');
    const [mapCenter, setMapCenter] = useState([4.6, -74.2]); // Centro de Colombia por defecto

    useEffect(() => {
        fetch('http://localhost:5000/api/sismos')
            .then(res => res.json())
            .then(data => {
                setSismos(data);
                // Extraer departamentos únicos
                const deptosSet = [...new Set(data.map(s => s.departamento).filter(Boolean))].sort();
                setDepartamentos(deptosSet);
            })
            .catch(err => console.error("Error al cargar sismos para el mapa:", err));
    }, []);

    // Actualizar lista de municipios según el departamento seleccionado
    useEffect(() => {
        if (selectedDepto === 'TODOS') {
            setMunicipios([]);
            setSelectedMuni('TODOS');
        } else {
            const munisSet = [...new Set(
                sismos
                    .filter(s => s.departamento === selectedDepto)
                    .map(s => s.municipio)
                    .filter(Boolean)
            )].sort();
            setMunicipios(munisSet);
            setSelectedMuni('TODOS');
        }
    }, [selectedDepto, sismos]);

    // Filtrado de sismos
    const filteredSismos = sismos.filter(s => {
        const fecha = s.fecha_hora ? new Date(s.fecha_hora) : null;
        const anio = fecha ? fecha.getFullYear().toString() : '';
        const mes = fecha ? (fecha.getMonth() + 1).toString() : '';

        const matchDepto = selectedDepto === 'TODOS' || s.departamento === selectedDepto;
        const matchMuni = selectedMuni === 'TODOS' || s.municipio === selectedMuni;
        const matchAnio = selectedAnio === 'TODOS' || anio === selectedAnio;
        const matchMes = selectedMes === 'TODOS' || mes === selectedMes;

        return matchDepto && matchMuni && matchAnio && matchMes;
    });

    // Actualizar centro del mapa si hay sismos filtrados
    useEffect(() => {
        if (filteredSismos.length > 0) {
            const avgLat = filteredSismos.reduce((acc, s) => acc + (s.latitud || 0), 0) / filteredSismos.length;
            const avgLon = filteredSismos.reduce((acc, s) => acc + (s.longitud || 0), 0) / filteredSismos.length;
            setMapCenter([avgLat, avgLon]);
        }
    }, [selectedDepto, selectedMuni, selectedAnio, selectedMes]);

    const getRiesgoColor = (mag) => {
        if (mag >= 4.5) return '#dc2626'; // Alto
        if (mag >= 3.0) return '#f59e0b'; // Medio
        return '#10b981'; // Bajo
    };

    const getBadgeClass = (mag) => {
        if (mag >= 4.5) return 'alto';
        if (mag >= 3.0) return 'medio';
        return 'bajo';
    };

    return (
        <div className="map-view-wrapper">
            <div className="map-header">
                <h2>Mapa de Calor e Historial Sísmico</h2>
                <p>Visualización geoespacial avanzada con filtros interactivos por región y temporalidad</p>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="filters-bar">
                <div className="filter-group">
                    <label>Departamento</label>
                    <select value={selectedDepto} onChange={e => setSelectedDepto(e.target.value)}>
                        <option value="TODOS">Todos los Departamentos</option>
                        {departamentos.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Municipio</label>
                    <select value={selectedMuni} onChange={e => setSelectedMuni(e.target.value)} disabled={selectedDepto === 'TODOS'}>
                        <option value="TODOS">Todos los Municipios</option>
                        {municipios.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Año</label>
                    <select value={selectedAnio} onChange={e => setSelectedAnio(e.target.value)}>
                        <option value="TODOS">Todos los Años</option>
                        {Array.from({ length: 21 }, (_, i) => 2006 + i).map(anio => (
                            <option key={anio} value={anio.toString()}>{anio}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Mes</label>
                    <select value={selectedMes} onChange={e => setSelectedMes(e.target.value)}>
                        <option value="TODOS">Todos los Meses</option>
                        {[
                            { num: '1', name: 'Enero' }, { num: '2', name: 'Febrero' }, { num: '3', name: 'Marzo' },
                            { num: '4', name: 'Abril' }, { num: '5', name: 'Mayo' }, { num: '6', name: 'Junio' },
                            { num: '7', name: 'Julio' }, { num: '8', name: 'Agosto' }, { num: '9', name: 'Septiembre' },
                            { num: '10', name: 'Octubre' }, { num: '11', name: 'Noviembre' }, { num: '12', name: 'Diciembre' }
                        ].map(mes => (
                            <option key={mes.num} value={mes.num}>{mes.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="map-legend">
                <span><i style={{background: '#10b981'}}></i> Bajo (&lt; 3.0)</span>
                <span><i style={{background: '#f59e0b'}}></i> Medio (3.0 - 4.4)</span>
                <span><i style={{background: '#dc2626'}}></i> Alto (&ge; 4.5)</span>
                <span style={{marginLeft: 'auto', fontWeight: '600', color: '#2563eb'}}>
                    Eventos encontrados: {filteredSismos.length}
                </span>
            </div>

            {/* CONTENEDOR DEL MAPA */}
            <div className="leaflet-box">
                <MapContainer center={mapCenter} zoom={7} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <MapRecenter center={mapCenter} />
                    
                    {filteredSismos.map((s, index) => (
                        <CircleMarker
                            key={index}
                            center={[s.latitud, s.longitud]}
                            radius={Math.max(4, (s.magnitud || 2) * 2)}
                            pathOptions={{
                                fillColor: getRiesgoColor(s.magnitud),
                                color: getRiesgoColor(s.magnitud),
                                weight: 1,
                                fillOpacity: 0.7
                            }}
                        >
                            <Popup>
                                <strong>Fecha:</strong> {new Date(s.fecha_hora).toLocaleString()}<br/>
                                <strong>Magnitud:</strong> {s.magnitud}<br/>
                                <strong>Profundidad:</strong> {s.profundidad} km<br/>
                                <strong>Municipio:</strong> {s.municipio || 'N/D'}<br/>
                                <strong>Departamento:</strong> {s.departamento || 'N/D'}
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>

            {/* TABLA DE REGISTROS DEBAJO DEL MAPA */}
            <div className="table-section-box">
                <h3>Historial de Sismos Filtrados</h3>
                <p>Listado detallado de los eventos sísmicos según los criterios seleccionados</p>
                
                <div className="table-responsive">
                    <table className="seismic-table">
                        <thead>
                            <tr>
                                <th>Fecha y Hora</th>
                                <th>Magnitud</th>
                                <th>Profundidad (km)</th>
                                <th>Departamento</th>
                                <th>Municipio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSismos.length > 0 ? (
                                filteredSismos.slice(0, 100).map((s, idx) => (
                                    <tr key={idx}>
                                        <td>{s.fecha_hora ? new Date(s.fecha_hora).toLocaleString() : 'N/D'}</td>
                                        <td>
                                            <span className={`badge-magnitud ${getBadgeClass(s.magnitud)}`}>
                                                {s.magnitud}
                                            </span>
                                        </td>
                                        <td>{s.profundidad}</td>
                                        <td>{s.departamento || 'N/D'}</td>
                                        <td>{s.municipio || 'N/D'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                                        No se encontraron sismos con los filtros seleccionados.
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