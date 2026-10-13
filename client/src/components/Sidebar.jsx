import React from 'react';
import { LayoutDashboard, Map, BrainCircuit, BarChart3 } from 'lucide-react';
import logoImage from '../assets/logo.jpg'; 
import '../styles/Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab }) {
    return (
        <aside className="seph-sidebar">
            <div className="sidebar-brand">
                <img src={logoImage} alt="Logo Green Hacker" className="brand-logo-img" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                    <h2 style={{ fontSize: '1.1rem', margin: 0 }}>SEIS SISMIMONITOR</h2>
                    <span className="brand-sub">Green Hacker Team</span>
                </div>
            </div>

            <div className="sidebar-section">
                <span className="section-title">PRINCIPAL</span>
                <button 
                    className={activeTab === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
                    onClick={() => setActiveTab('dashboard')}
                >
                    <LayoutDashboard size={18} /> Dashboard
                </button>
                <button 
                    className={activeTab === 'mapa' ? 'nav-btn active' : 'nav-btn'}
                    onClick={() => setActiveTab('mapa')}
                >

<Map size={18} />
Mapa de Calor
                </button>
                <button 
                    className={activeTab === 'predicciones' ? 'nav-btn active' : 'nav-btn'}
                    onClick={() => setActiveTab('predicciones')}
                >
                    <BrainCircuit size={18} /> Predicciones ML
                </button>
                <button 
                    className={activeTab === 'estadisticas' ? 'nav-btn active' : 'nav-btn'}
                    onClick={() => setActiveTab('estadisticas')}
                >
                    <BarChart3 size={18} /> Estadísticas
                </button>
            </div>
        </aside>
    );
}