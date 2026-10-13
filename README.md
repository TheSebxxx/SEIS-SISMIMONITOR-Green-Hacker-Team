# 🌋 SEIS SISMIMONITOR — Plataforma de Inteligencia Artificial para la Predicción y Análisis de Riesgo Sísmico

> **Proyecto desarrollado para la Hackatón de las Unidades Tecnológicas de Santander (UTS)**  
> **Equipo:** Green Hacker Team  
> **Estado:** En Producción (Desplegado en Render & Supabase)

---

## 📋 1. Descripción del Proyecto
**SEIS SISMIMONITOR** es una plataforma web full-stack de alto rendimiento desarrollada para el monitoreo geoespacial, análisis estadístico y predicción del riesgo sísmico, con un enfoque geográfico estratégico en el **Nido Sísmico de Bucaramanga** y el departamento de Santander (Colombia). 

La aplicación procesa y visualiza grandes volúmenes de datos históricos oficiales del **Servicio Geológico Colombiano (SGC)** e integra un modelo de Machine Learning supervisado para clasificar dinámicamente el nivel de amenaza y vulnerabilidad de las zonas analizadas.

---

## 🏗️ 2. Arquitectura del Sistema
El sistema está construido bajo una arquitectura desacoplada y optimizada para la nube:

* **Frontend:** Desarrollado en **React (Vite)**, estructurado con una interfaz modular que incluye mapas geoespaciales interactivos (**Leaflet**), analítica visual (**Recharts**) y una identidad visual personalizada (**Green Hacker Team**).
* **Backend:** API REST construida en **Node.js** con **Express.js**, optimizada para la gestión de consultas masivas y la paginación eficiente de registros históricos.
* **Base de Datos & Cloud:** **Supabase (PostgreSQL)**, que almacena y gestiona de manera segura el catálogo masivo de eventos sísmicos.
* **Machine Learning:** Modelo supervisado basado en **Random Forest** entrenado con todo el catálogo histórico de sismos, logrando una exactitud (*Accuracy*) del **98.4%** en la validación cruzada para la zonificación de riesgo.

---

## ✨ 3. Características Principales

1. **Dashboard Analítico en Tiempo Real:** Métricas globales del comportamiento sísmico, conteo total de eventos en la región, magnitud máxima registrada y epicentros clave.
2. **Mapa de Calor e Historial Sísmico Avanzado:** Visualización geográfica de los eventos con filtros dinámicos por departamento, municipio, año y mes. Incorpora paginación optimizada para garantizar fluidez visual sin comprometer la memoria del navegador.
3. **Módulo de Predicciones de Riesgo (ML):** Mapa interactivo de zonificación de riesgos clasificados en niveles (*Bajo, Medio, Alto*), respaldados por las predicciones del modelo de inteligencia artificial.
4. **Módulo de Estadísticas y Validación Técnica:** Justificación metodológica detallada del rendimiento del modelo de Machine Learning y su aplicabilidad en la gestión de desastres en Santander.

---

## 🚀 4. Estructura del Repositorio

```text
SEIS-SISMIMONITOR/
├── client/                 # Aplicación Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/         # Logotipos e imágenes institucionales
│   │   ├── components/     # Componentes modulares (Sidebar, Mapas, etc.)
│   │   └── styles/         # Hojas de estilo personalizadas
│   └── package.json
├── server/                 # Aplicación Backend (Node.js + Express)
│   ├── index.js            # Servidor y endpoints optimizados (/api/sismos, etc.)
│   └── package.json
└── README.md
