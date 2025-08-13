import React, { memo, useEffect, useState } from 'react';

const ContadorRecibido = memo(({ grupo, onConfirmar }) => {
  const {
    clienteNombre,
    maquinaNombre,
    fechaFormateada,
    imagen,
    envios,
    clienteId,
  } = grupo;
  const [mensajes, setMensajes] = useState({});
  const API_URL=import.meta.env.VITE_API_URL

  useEffect(() => {
  const inicial = {};
  envios.forEach(envio => {
    inicial[envio.id] = envio.mensaje || ''; // mensaje precargado si lo hay
  });
  setMensajes(inicial);
}, [envios]);



  const handleInputChange = (id, value) => {
    setMensajes(prev => ({
      ...prev,
      [id]: value
    }));
  };

   const handleConfirmar = () => {
    const mensajesGrupo = envios.map(envio => {
      const inputValor = mensajes[envio.id];
      const mensaje = inputValor != null ? String(inputValor).trim() : '';
      return {
        envioId: envio.id,
        mensaje,
        tipoImpresion: envio.tipoImpresion
      };
    })
    .filter(m => m.mensaje);
    // (envio => ({

    //   envioId: envio.id,
    //   mensaje: String(mensajes[envio.id]).trim(),
    //   tipoImpresion: envio.tipoImpresion
    // }))
    

    const dataParaEnviar = {
      clienteNombre,
      maquinaNombre,
      fechaFormateada,
      imagen,
      mensajes: mensajesGrupo
    };

    onConfirmar(dataParaEnviar); 
  };

  const handleEliminar = (id) => () => {
    fetch(`${API_URL}/envioContador/${id}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
  
        }
      })
      .then(async (r) => {
        if (r.status === 204) {
            toast("Solicitud eliminada");
            console.log(r.status)
        } else {
            console.log(r.status)
            toast(r.mensaje || "Error eliminando solicitud");
        }
      })
      .catch((err) => {
        console.log("Error en la conexión: " + err)
        toast("Error de conexión al eliminar solicitud");
      });
    }

  return (
    <div className="envio-contador">
      <h2>{clienteNombre}</h2>
      <h3>{maquinaNombre}</h3>
      <p className='contador-p'>{fechaFormateada}</p>

      <div className="grid-contador">
        <div className="imagen-col">
          <img
            src={`data:image/jpeg;base64,${imagen}`}
            alt="Imagen del contador"
            className="imagen-contador"
            loading="lazy"
          />
        </div>

        <div className="input-col">
          {envios.map((envio) => (
            <div key={envio.id} style={{ marginBottom: '1rem' }}>
              <label>
                <strong>{envio.tipoImpresion === 1 ? 'B/N' : 'Color'}:</strong>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Escribe el valor"
                  value={mensajes[envio.id] ?? ''}
                  onChange={(e) => handleInputChange(envio.id, e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>

        <div className="btn-col">
          <button className="btn-reenviar" onClick={() => console.log('Reenviar solicitud', clienteId)}>
            Reenviar solicitud
          </button>
        </div>

        <div className="btn-col">
          <button className="btn-confirmar" onClick={handleConfirmar}>
            Confirmar
          </button>
        </div>
        <div className="btn-col">
            <button className='btn-eliminar' onClick={handleEliminar()}>
                Eliminar
            </button>
        </div>
      </div>
    </div>
  );
});

export default ContadorRecibido;
