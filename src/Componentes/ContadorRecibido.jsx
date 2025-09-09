import { bn } from 'date-fns/locale';
import React, { memo, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ContadorRecibido = memo(({ grupo, onConfirmar }) => {
  const {
    clienteNombre,
    maquinaNombre,
    maquinaId,
    fechaFormateada,
    imagen,
    envios,
    clienteId,
  } = grupo;
  
  // mensajes: { [envioId]: {bn: string, color: string }}
  const [mensajes, setMensajes] = useState({});
  const API_URL=import.meta.env.VITE_API_URL
  const token = localStorage.getItem("token");

  useEffect(() => {
  const inicial = {};
  envios.forEach(envio => {
    
    const bn = envio.mensajeBN ??
    (typeof envio.mensaje === 'string' ? envio.mensaje : '') ?? '';
    const color = envio.mensajeColor ?? '';
    inicial[envio.id] = {
      bn: bn ?? '',
      color: color ?? ''
    };
  });
  setMensajes(inicial);
}, [envios]);

  const handleInputChange = (id, campo, value) => {
    setMensajes(prev => ({
      ...prev,
      [envioId]: {
        ...prev[envioId] ?? {bn: '', color: ''},
        [campo]: value
      }
    }));
  }

   // Puede confirmar si al menos un campo tiene valores ingresados
    const puedeConfirmar = Object.values(mensajes).some(v => (v?.bn?.toString().trim() || v?.color?.toString().trim()));

    

  const handleConfirmar = () => {
    // if(!puedeConfirmar) {
    //   toast.error("Debe ingresar la cantidad de copias para confirmar");
    //   return;
    // }
    const mensajesGrupo = envios.flatMap(envio => {
      const entry = mensajes[envio.id] || {bn: '', color: ''};
      const bn = String(entry.bn ?? '').trim();
      const color = String(entry.color ?? '').trim();

      const items = [];
      if (bn) {
        items.push({
          clienteId,
          envioId: envio.id,
          maquinaId: envio.maquinaId,
          mensaje: bn,
          tipoImpresion: 1
        });
      }
      if (envio.tipoImpresion === 0 && color) {
        items.push({
          clienteId,
          envioId: envio.id,
          maquinaId: envio.maquinaId,
          mensaje: color,
          tipoImpresion: 0
        });
      }
      return items;
    });

    const dataParaEnviar = {
      clienteNombre,
      clienteId,
      maquinaNombre,
      maquinaId,
      fechaFormateada,
      imagen,
      envioIds: envios.map(e => e.id),
      mensajes: mensajesGrupo
    };
    onConfirmar(dataParaEnviar);
  }

//   useEffect(() => {
//   const inicial = {};
//   envios.forEach(envio => {
//     inicial[envio.id] = envio.mensaje || ''; // mensaje precargado si lo hay
//   });
//   setMensajes(inicial);
// }, [envios]);

  // const handleInputChange = (id, value) => {
  //   setMensajes(prev => ({
  //     ...prev,
  //     [id]: value
  //   }));
  // };

  //  const handleConfirmar = () => {
  //   const mensajesGrupo = envios.map(envio => {
  //     const inputValor = mensajes[envio.id];
  //     const mensaje = inputValor != null ? String(inputValor).trim() : '';
  //     return {
  //       clienteId: clienteId,
  //       envioId: envio.id,
  //       maquinaId: envio.maquinaId,
  //       mensaje,
  //       tipoImpresion: envio.tipoImpresion
  //     };
  //   })
  //   .filter(m => m.mensaje);

  //   const dataParaEnviar = {
  //     clienteNombre,
  //     clienteId,
  //     maquinaNombre,
  //     maquinaId,
  //     fechaFormateada,
  //     imagen,
  //     envioIds: envios.map(e => e.id),
  //     mensajes: mensajesGrupo
  //   };

  //   onConfirmar(dataParaEnviar); 
  // };

  const handleEliminarGrupo = async () => {
    try{
      const res = await Promise.allSettled(
        envios.map(e =>
      
    fetch(`${API_URL}/envioContador/${e.id}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
  
        }
      })
    ))
     const ok = res.filter(r => r.status === 'fulfilled' && r.value?.status === 204).length;
      const fail = res.length - ok;

      if(ok) toast.success(`Contador eliminado con éxito`);
      if(fail) toast.error(`Error eliminando el contador`);


    } catch {
        toast("Error eliminando el contador");
    }
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
          {envios.map((envio) => {
            const val = mensajes[envio.id] || {bn: '', color: ''};
            return (
              <div key={envio.id}>
              <div  style={{ marginBottom: '1rem' }}>
              <label>
                <strong>{envio.tipoImpresion == "Monocromatico" ? "B/N" : "Color"}</strong>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Escribe el valor"
                  value={val.bn}
                  onChange={(e) => handleInputChange(envio.id, 'bn', e.target.value)}
                  inputMode='numeric'
                />
              </label>
            </div>
           </div>
            )
          })}
        </div>

       
    
        <div className="acciones" >
        <button className="btn-reenviar" onClick={() => console.log('Reenviar solicitud grupo', clienteId)}>
          Reenviar solicitud
        </button>
        
        <button className="eliminar" style={{ marginTop: '1rem' }} onClick={handleEliminarGrupo}>
          Eliminar
        </button>

        <button className="btn-confirmar" style={{ marginTop: '1rem' }} onClick={handleConfirmar} disabled={!puedeConfirmar}>
          Confirmar
        </button>
        
      </div>
      </div>
    </div>
  );
});

export default ContadorRecibido;
