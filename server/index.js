import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Apuntando correctamente al archivo .env ubicado en la raíz del proyecto
dotenv.config({ path: '../.env' });

const app = express(); // 👈 ¡Debe ir aquí arriba, antes de usar app.get o app.use!
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Endpoint con filtros por año y mes optimizados
app.get('/api/sismos', async (req, res) => {
    try {
        const { anio, mes } = req.query;
        let query = supabase.from('seismic_events').select('*');

        if (anio && anio !== 'Todos' && anio !== 'Todos los Años') {
            const startDate = `${anio}-01-01T00:00:00`;
            const endDate = `${anio}-12-31T23:59:59`;
            query = query.gte('fecha_hora', startDate).lte('fecha_hora', endDate);
        } else {
            query = query.order('fecha_hora', { ascending: false }).limit(5000);
        }

        const { data, error } = await query;
        if (error) throw error;

        let filteredData = data;
        if (mes && mes !== 'Todos los Meses') {
            const mesesMap = {
                'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4,
                'Mayo': 5, 'Junio': 6, 'Julio': 7, 'Agosto': 8,
                'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12
            };
            const mesNum = mesesMap[mes];
            if (mesNum) {
                filteredData = data.filter(sismo => {
                    const fechaSismo = new Date(sismo.fecha_hora);
                    return (fechaSismo.getMonth() + 1) === mesNum;
                });
            }
        }

        res.json(filteredData);
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