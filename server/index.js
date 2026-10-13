import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Endpoint con paginación masiva para "TODOS" y búsqueda filtrada por año específico
app.get('/api/sismos', async (req, res) => {
    try {
        const { anio, mes } = req.query;
        let data = [];
        let error = null;

        // Si el usuario selecciona un año específico
        if (anio && anio !== 'TODOS' && anio !== 'Todos los Años') {
            const startDate = `${anio}-01-01T00:00:00`;
            const endDate = `${anio}-12-31T23:59:59`;
            
            // Consultamos todos los sismos de ese año sin límite estricto de 5000
            let query = supabase.from('seismic_events').select('*')
                .gte('fecha_hora', startDate)
                .lte('fecha_hora', endDate)
                .order('fecha_hora', { ascending: false });

            const response = await query;
            data = response.data || [];
            error = response.error;
        } else {
            // Si selecciona "TODOS", aplicamos el sistema por lotes hasta 15,000 registros
            let allData = [];
            let batchSize = 1000;
            let maxRecords = 15000;
            let from = 0;
            let to = batchSize - 1;
            let fetching = true;

            while (fetching && allData.length < maxRecords) {
                const batchResponse = await supabase
                    .from('seismic_events')
                    .select('*')
                    .order('fecha_hora', { ascending: false })
                    .range(from, to);

                if (batchResponse.error) throw batchResponse.error;

                const batchData = batchResponse.data;
                if (batchData && batchData.length > 0) {
                    allData = allData.concat(batchData);
                    if (batchData.length < batchSize || allData.length >= maxRecords) {
                        fetching = false;
                    } else {
                        from += batchSize;
                        to += batchSize;
                    }
                } else {
                    fetching = false;
                }
            }
            data = allData;
        }

        if (error) throw error;

        let filteredData = data || [];

        // Filtro por Mes (compatible con número o texto)
        if (mes && mes !== 'TODOS' && mes !== 'Todos los Meses') {
            let mesNum = parseInt(mes, 10);

            const mesesMap = {
                'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4,
                'Mayo': 5, 'Junio': 6, 'Julio': 7, 'Agosto': 8,
                'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12
            };

            if (isNaN(mesNum) && mesesMap[mes]) {
                mesNum = mesesMap[mes];
            }

            if (!isNaN(mesNum)) {
                filteredData = filteredData.filter(sismo => {
                    if (!sismo.fecha_hora) return false;
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