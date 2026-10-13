import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SeismicMap from './components/SeismicMap';
import PredictionsMap from './components/PredictionsMap';
import Statistics from './components/Statistics';
import './App.css';

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="app-container">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="main-content">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'mapa' && <SeismicMap />}
                {activeTab === 'predicciones' && <PredictionsMap />}
                {activeTab === 'estadisticas' && <Statistics />}
            </main>
        </div>
    );
}