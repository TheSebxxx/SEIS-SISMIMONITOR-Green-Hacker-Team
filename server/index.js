app.get('/api/sismos', async (req, res) => {
    try {
        const { anio, mes } = req.query;
        let query = supabase.from('seismic_events').select('*');

        // Si el usuario selecciona un año específico
        if (anio && anio !== 'Todos' && anio !== 'Todos los Años') {
            // Suponiendo que tu columna de fecha se llama 'fecha_hora' (formato ISO o timestamp)
            // Filtramos por el rango de ese año completo
            const startDate = `${anio}-01-01T00:00:00`;
            const endDate = `${anio}-12-31T23:59:59`;
            query = query.gte('fecha_hora', startDate).lte('fecha_hora', endDate);
        } else {
            // Si no selecciona año, mantenemos el límite de los más recientes para no saturar
            query = query.order('fecha_hora', { ascending: false }).limit(5000);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Filtro adicional de mes en código si se seleccionó un mes específico
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