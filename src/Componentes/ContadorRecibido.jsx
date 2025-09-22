import { bn } from 'date-fns/locale';
import React, { memo, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ContadorRecibido = memo(({ grupo, onConfirmar }) => {
  const {
    contadorId,
    costo,
    clienteNombre,
    maquinaNombre,
    maquinaId,
    fechaFormateada,
    imagen,
    envios,
    clienteId,
  } = grupo;
  // console.log("grupo: ", grupo) // Muestra undefined
  
  // mensajes: { [envioId]: {bn: string, color: string }}
  const [mensajes, setMensajes] = useState({});
  const API_URL=import.meta.env.VITE_API_URL
  const token = localStorage.getItem("token");

useEffect(() => {
  const inicial = {};
  envios.forEach(envio => {
    const bn = envio.tipoImpresion === "Monocromatico" ? envio.mensaje : '';
    const color = envio.tipoImpresion === "Color" ? envio.mensaje : '';
    inicial[envio.id] = {
      bn,
      color
    };
  });
  setMensajes(inicial);
}, [envios]);


  const handleInputChange = (id, campo, value) => {
    setMensajes(prev => ({
      ...prev,
      [id]: {
        ...prev[id] ?? {bn: '', color: ''},
        [campo]: value
      }
    }));
  }

   // Puede confirmar si al menos un campo tiene valores ingresados
    const puedeConfirmar = Object.values(mensajes).some(v => (v?.bn?.toString().trim() || v?.color?.toString().trim()));

    

  const handleConfirmar = () => {
  
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
          tipoImpresion: "Monocromatico"
        });
      }
      if (envio.tipoImpresion === "Color" && color) {
        // console.log("envioColor: ",envio)
        items.push({
          clienteId,
          envioId: envio.id,
          maquinaId: envio.maquinaId,
          mensaje: color,
          tipoImpresion: "Color"
        });
      }
      return items;
    });
  
    
    const enviosContadores = []
    const envioMono = envios.find(e => e.tipoImpresion === "Monocromatico");
const [dia, mes, anioHora] = fechaFormateada.split('/');
const [anio, hora] = anioHora.split(' ');
const fechaISO = new Date(`${anio}-${mes}-${dia}T${hora}:00`).toISOString();

    const envioByN = {
      id: envioMono.id,
      clienteId,
      cliente: null,
      maquinaId,
      maquina: null,
      fechaYHora: fechaISO,
      confirmado: false,
      contador: 0,
      tipoImpresion: "Monocromatico",
      imagen: '',
      mensaje: mensajesGrupo.find(
        m => m.envioId === envioMono.id && m.tipoImpresion === "Monocromatico"
      )?.mensaje || ''
    };
    enviosContadores.push(envioByN)
    const envioCol = envios.find(e => e.tipoImpresion === "Color")
    if(envioCol){
    
     const envioColor = {
      id: envioCol.id,
      clienteId,
      cliente: null,
      maquinaId,
      maquina: null,
      fechaYHora: fechaISO,
      confirmado: false,
      contador: 0,
      tipoImpresion: "Color",
      imagen: "",
      mensaje: mensajesGrupo.find(
        m => m.envioId === envioCol.id && m.tipoImpresion === "Color"
      )?.mensaje || ''
    };
    
      enviosContadores.push(envioColor)
    }
    const contadorAConfirmar = {
      id: contadorId,
      costo: 0,
      costoBYN: 0,
      costoColor: 0,
      enviosContadores: enviosContadores,
    }
    console.log("contador a confirmar: ", JSON.stringify(contadorAConfirmar, null, 2));

    fetch(`${API_URL}/contador/confirmar`, {
      method: 'PUT',
      body: JSON.stringify(contadorAConfirmar),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(r => {
        if (!r.ok) throw new Error("Error en la respuesta del servidor");
        // toast.success("Máquina modificada con éxito.");
        // console.log(r)
        // navigate("/");
        return r.json();
      })
      .catch(error => {
        console.error("Error al confirmar contador:", error);
        toast.error("Error al confirmar el contador.");
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
                value={envio.tipoImpresion === "Monocromatico" ? val.bn : val.color}
                onChange={(e) => handleInputChange(
                  envio.id,
                  envio.tipoImpresion === "Monocromatico" ? 'bn' : 'color',
                  e.target.value
                )}
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
