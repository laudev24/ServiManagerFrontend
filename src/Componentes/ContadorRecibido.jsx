import React, { memo } from 'react';

const ContadorRecibido = memo(({ grupo, onMensajeChange }) => {
  const {
    clienteNombre,
    maquinaNombre,
    fechaFormateada,
    imagen,
    envios,
    clienteId,
  } = grupo;

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
                  defaultValue={envio.mensaje || ''}
                  onChange={(e) => onMensajeChange(envio.id, e.target.value)}
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
          <button className="btn-confirmar" onClick={() => console.log('Confirmar')}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
});

export default ContadorRecibido;
