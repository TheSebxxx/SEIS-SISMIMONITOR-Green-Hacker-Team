import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Apuntando correctamente al archivo .env ubicado en la raíz del proyecto
dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Endpoint con paginación por lotes para traer 5000 registros saltando el límite de 1000 de Supabase
app.get('/api/sismos', async (req, res) => {
    try {
        let allData = [];
        let batchSize = 1000;
        let maxRecords = 15000;// Límite total de registros para mantener el rendimiento fluido
        let from = 0;
        let to = batchSize - 1;
        let fetching = true;

        while (fetching && allData.length < maxRecords) {
            const { data, error } = await supabase
                .from('seismic_events')
                .select('*')
                .order('fecha_hora', { ascending: false })
                .range(from, to);

            if (error) throw error;

            if (data && data.length > 0) {
                allData = allData.concat(data);
                if (data.length < batchSize || allData.length >= maxRecords) {
                    fetching = false; // Detener cuando ya no hay más registros o se alcanzó el tope
                } else {
                    from += batchSize;
                    to += batchSize;
                }
            } else {
                fetching = false;
            }
        }

        res.json(allData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para las clasificaciones de riesgo del modelo ML
app.get('/api/clasificaciones', async (req, res) => {
    try {
        const { data, error } = await supabase.from('zone_classifications').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});