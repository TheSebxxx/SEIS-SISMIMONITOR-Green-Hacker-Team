import os
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

# Cargar variables de entorno
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def subir_sismos_a_supabase(ruta_csv):
    print("📂 Leyendo el dataset de sismos...")
    df = pd.read_csv(ruta_csv)
    
    print(f"📊 Total de registros encontrados en el archivo: {len(df)}")
    
    registros = []
    for _, row in df.iterrows():
        # Extraer departamento y municipio de la columna 'place' (ej: 'Los Santos - Santander, Colombia')
        place_str = str(row.get('place', ''))
        partes = place_str.split('-')
        municipio = partes[0].strip().upper() if len(partes) > 0 else "DESCONOCIDO"
        
        # Extraer departamento si está presente
        depto = "SANTANDER"
        if "Santander" in place_str:
            depto = "SANTANDER"
        elif len(partes) > 1:
            depto = partes[1].split(',')[0].strip().upper()

        # Manejo de la fecha (puede venir en utc_time o local_time)
        fecha_val = row.get('utc_time') if pd.notna(row.get('utc_time')) else row.get('local_time')

        evento = {
            "evento_id": str(row.get('id')),
            "fecha_hora": pd.to_datetime(fecha_val).isoformat(),
            "latitud": float(row.get('latitude')),
            "longitud": float(row.get('longitude')),
            "profundidad": float(row.get('depth')) if pd.notna(row.get('depth')) else 0.0,
            "magnitud": float(row.get('magnitude')) if pd.notna(row.get('magnitude')) else 0.0,
            "departamento": depto,
            "municipio": municipio
        }
        registros.append(evento)
    
    print(f"💾 Subiendo registros a Supabase en lotes...")
    
    # Inserción en bloques de 500 para evitar límites de tamaño por petición
    batch_size = 500
    for i in range(0, len(registros), batch_size):
        batch = registros[i:i + batch_size]
        try:
            supabase.table("seismic_events").upsert(batch, on_conflict="evento_id").execute()
            print(f"   -> Lote {i} al {i + len(batch)} subido con éxito.")
        except Exception as e:
            print(f"❌ Error en el lote {i}: {e}")
            
    print("🎉 ¡Proceso finalizado! Todos los sismos ya están en tu base de datos de Supabase.")

if __name__ == "__main__":
    # Ruta corregida apuntando a la carpeta dataset y tu archivo exacto
    archivo_csv = "dataset/catalogo_sismos_2006_2026.csv"
    subir_sismos_a_supabase(archivo_csv)