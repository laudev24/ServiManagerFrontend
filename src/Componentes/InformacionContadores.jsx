import React from 'react'
import { useLocation } from 'react-router-dom';

const InformacionContadores = () => {

    const { state } = useLocation();

    console.log("Datos recibidos:", state); // acá tenés todo

    //Necesito:
    //contador anterior o el que se ingreso al registrar la maquina


  return (
    
    <div>
      <h1>{state.clienteNombre}</h1>
      <h2>{state.maquinaNombre}</h2>
      <p>{state.fechaFormateada}</p>

        {state.mensajes.map((m, i) => (
            
     <div key={i} className="tabla-resumen">
  <h3>{m.tipoImpresion === 1 ? "B/N" : "Color"}</h3>

  <table>
    <tbody>
      {/* Inicial y Final */}
      <tr>
        <td><em>Inicial:</em></td>
        <td>xxxxx</td>
      </tr>
      <tr>
        <td><em>Final:</em></td>
        <td>{m.mensaje}</td>
      </tr>

      {/* Total y Monto a abonar */}
      <tr>
        <td><em>Total copias:</em></td>
        <td>xxxx</td>

      </tr>
      <tr>
        <td><em>Monto a abonar {m.tipoImpresion === 1 ? "B/N" : "Color"}:</em></td>

        <td>xxxx</td>
      </tr>

      {/* Descuento */}
      <tr>
        <td colSpan="2">
          <label>Descuento:
            <input type="text" className="input-descuento" />
          </label>
        </td>
      </tr>

      {/* Total y Monto con descuento */}
      <tr>
        <td><em>Total copias con descuento:</em></td>
        <td>xxxxxxx</td>
      </tr>
      <tr>
        <td><em>Total a abonar con descuento {m.tipoImpresion === 1 ? "B/N" : "Color"}:</em></td>
        <td>xxxxx</td>
      </tr>
    </tbody>
  </table>
</div>

        ))}
        <button>Guardar</button>
        <button>Enviar a {state.clienteNombre}</button>
    </div>
  )
}

export default InformacionContadores