import React, { memo } from 'react';

const ContadorRecibido = memo(({ envio, buscarCliente, buscarMaquina, onMensajeChange }) => {
  return (
    <div className="envio-contador">
      <h2>{buscarCliente(envio.clienteId)}</h2>
      <h3>{buscarMaquina(envio.maquinaId)}</h3>
      <p className='contador-p'>Contador {envio.tipoImpresion === 1 ? 'B/N' : 'Color'}</p>
      <p className="contador-p">{new Date(envio.fechaYHora).toLocaleString('es-AR')}</p>

      <div className="grid-contador">
        <div className="imagen-col">
          <img
            src={`data:image/jpeg;base64,${envio.imagen}`}
            alt="Imagen del contador"
            className="imagen-contador"
          />
        </div>

        <div className="input-col">
          <label>
            Ingresar valor:
            <input
              type="text"
              className="form-control"
              placeholder="Escribe el valor"
              defaultValue={envio.mensaje || ''}
              onChange={(e) => onMensajeChange(envio.id, e.target.value)}
            />
          </label>
        </div>

        <div className="btn-col">
          <button className="btn-reenviar" onClick={() => console.log('Reenviar solicitud', envio.clienteId)}>
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
