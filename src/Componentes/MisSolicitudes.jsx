import React, { useEffect, useState } from 'react'
import Solicitud from './Solicitud'


const MisSolicitudes = () => {
    const token = localStorage.getItem("token")
    const API_URL=import.meta.env.VITE_API_URL
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorSolicitudes, setErrorSolicitudes] = useState(null);
    const clienteId = Number(localStorage.getItem("clienteId"));

    useEffect(() => {
        let cancelado = false;
        async function cargar() {
            
            setLoading(true);
            try {
                // 1) Traer solicitudes
                const r = await fetch(`${API_URL}/solicitudServicio/cliente/${clienteId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!r.ok) throw new Error("Error al obtener solicitudes");
                const data = await r.json();
                if (cancelado) return;
                const lista = Array.isArray(data) ? data : [];
                // console.log("Solicitudes obtenidas:", lista);
                setSolicitudes(lista);
                if (cancelado) return;
                setLoading(false);
            } catch (e) {
                console.error(e);
                if (!cancelado) {
                    setErrorSolicitudes(e);
                    setLoading(false);
                }
            }
        }
        cargar();
        return () => {
            cancelado = true; // evita setState tras unmount
        };
    }, [token, clienteId]);

    if (loading) return <p>Cargando solicitudes...</p>;
    if (errorSolicitudes) return <p>Hubo un problema cargando las solicitudes.</p>;

  return (
    <div className="contenedor-menu">
  <div className="contenedor-secundario">
    {solicitudes.map((s) => (
      <Solicitud key={s.id} solicitud={s} />
    ))}
    {solicitudes.length === 0 && (
      <p className="sin-resultados">No hay solicitudes para mostrar.</p>
    )}
  </div>
</div>
  )
}

export default MisSolicitudes