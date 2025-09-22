import React, { useEffect, useMemo, useState } from 'react'
import Solicitud from './Solicitud';
import { toast } from 'react-toastify';


const Solicitudes = () => {
  const token = localStorage.getItem("token")
  const API_URL=import.meta.env.VITE_API_URL
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
        const r = await fetch(`${API_URL}/solicitudServicio`, {
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

  const handleEliminar = (idSol) => {
      fetch(`${API_URL}/solicitudServicio/${idSol}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
  
        }
      })
      .then(async (r) => {
        if (r.status === 204) {
            toast("Solicitud eliminada");
            //console.log(r.status)
            setSolicitudes(prev => prev.filter(c => c.id !== idSol));
        } else {
            //console.log(r.status)
            toast(r.mensaje || "Error eliminando solicitud");
        }
      })
      .catch((err) => {
        //console.log("Error en la conexión: " + err)
        toast("Error de conexión al eliminar solicitud");
      });
    }
 

  if (loading) return <p>Cargando solicitudes...</p>;
  if (errorSolicitudes) return <p>Hubo un problema cargando las solicitudes.</p>;
  

  return (
    <div className="contenedor-menu">
      <div className="contenedor-secundario">
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
        <br /><br />
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