import React, { useEffect, useMemo, useState } from 'react'
import Solicitud from './Solicitud';

const Solicitudes = () => {
  const token = localStorage.getItem("token")
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorSolicitudes, setErrorSolicitudes] = useState(null);
  const [mostrarAgrupadas, setMostrarAgrupadas] = useState(false);

   useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setLoading(true);
      try {
        // 1) Traer solicitudes
        const r = await fetch("https://localhost:5201/api/solicitudServicio", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!r.ok) throw new Error("Error al obtener solicitudes");
        const data = await r.json();
        if (cancelado) return;

        const lista = Array.isArray(data) ? data : [];
        console.log("Solicitudes obtenidas:", lista);
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
  }, [token]);


    const gruposPorCliente = useMemo(() => {
    const byId = solicitudes.reduce((acc, sol) => {
      const id = sol.clienteId;
      if (!id && id !== 0) return acc; // defensivo
      (acc[id] ||= []).push(sol);
      return acc;
    }, {});
    // array: [{ clienteId, solicitudes: [...] }]
    return Object.entries(byId).map(([clienteId, lista]) => ({
      clienteId: Number(clienteId),
      solicitudes: lista,
    }));
  }, [solicitudes]);

  const agruparPorCliente = () => setMostrarAgrupadas(true);
  const desagrupar = () => setMostrarAgrupadas(false);

  // TODO: definir tu lógica real de eliminar
  const handleEliminar = (id) => {
    setSolicitudes((prev) => prev.filter((s) => s.id !== id));
  };
 

  if (loading) return <p>Cargando solicitudes...</p>;
  if (errorSolicitudes) return <p>Hubo un problema cargando las solicitudes.</p>;
  

  return (
    <div className="contenedor-menu">
      <div className="formulario-cliente">
        <h1>Solicitudes Pendientes</h1>

        {!mostrarAgrupadas ? (
          <button className="btn-accion" onClick={agruparPorCliente}>
            Agrupar por cliente
          </button>
        ) : (
          <button className="btn-accion" onClick={desagrupar}>
            Ver sin agrupar
          </button>
        )}

        {!mostrarAgrupadas && (
          <>
            {solicitudes.map((s) => (
              <div key={s.id} className="solicitud-item">
                <Solicitud solicitud={s} />
                <button
                  className="btn-eliminar"
                  onClick={() => handleEliminar(s.id)}
                >
                  Eliminar
                </button>
              </div>
            ))}
            {solicitudes.length === 0 && (
              <p className="sin-resultados">No hay solicitudes para mostrar.</p>
            )}
          </>
        )}

        {mostrarAgrupadas && (
          <>
            {gruposPorCliente.map(({ clienteId, solicitudes: lista }) => (
              <section key={clienteId} className="grupo-cliente">
                <h3>Cliente #{clienteId}</h3>
                {lista.map((s) => (
                  <div key={s.id} className="solicitud-item">
                    <Solicitud solicitud={s} />
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(s.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </section>
            ))}

            {gruposPorCliente.length === 0 && (
              <p className="sin-resultados">No hay solicitudes para mostrar.</p>
            )}
          </>
        )}
      </div>
    </div>


  )
}

export default Solicitudes