import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

try:
    supabase = create_client(url, key)
    # Hacemos una consulta rápida a la tabla que creamos
    response = supabase.table("seismic_events").select("*").limit(1).execute()
    print("¡Conexión exitosa con Supabase!")
    print("Respuesta de la base de datos:", response)
except Exception as e:
    print(f"Error de conexión: {e}")