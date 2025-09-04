import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { useLocation } from 'react-router-dom';



const InformacionContadores = () => {

    const { state } = useLocation();
    const clienteId=state.clienteId
    const maquinaId=state.maquinaId
    const token = localStorage.getItem("token");
    const API_URL=import.meta.env.VITE_API_URL
    const [contadores, setContadores] = useState([])
    const [arrendamiento, setArrendamiento] = useState(null)
    const [loading, setLoading] = useState(true)
    const descuento = useRef(null);
    
    // console.log("Datos recibidos:", state); 


    const traerContadoresDelCliente = () => {
      
      fetch(`${API_URL}/contador/cliente/${clienteId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      })
      .then(r => r.ok ? r.json() : Promise.reject("Error al traer contadores del cliente"))
      .then(data => {
        console.log("Contadores del cliente:", data);
        setContadores(data);
      })
      .catch(e =>
        console.error("Error al obtener los contadores del cliente:", e))
      
    }

    useEffect(() => {
      if(clienteId && contadores.length===0) traerContadoresDelCliente()
    }, [clienteId]);

  

    const traerArrendamiento = () => {
      fetch(`${API_URL}/arrendamiento/maquina/${maquinaId}/cliente/${clienteId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      })
      .then(r => r.ok ? r.json() : Promise.reject("Error al traer arrendamiento"))
      .then(data => {
        console.log("Arrendamiento:", data);
        setArrendamiento(data);
        setLoading(false)
      })
      .catch(e =>
        console.error("Error al obtener el arrendamiento:", e))
    }

    useEffect(() => {
      if(maquinaId && clienteId) traerArrendamiento()
    }, [maquinaId, clienteId]);

    if (loading) {
      traerArrendamiento()
      return <p>Cargando datos...</p>;
    }

    const calcularTotalCopias = (m) => {
      const contadorFinal = parseInt(m.mensaje) || 0;
      const contadorInicial = parseInt(arrendamiento.UltimoContadorBYN || 0) 
      return (contadorFinal - contadorInicial);
    } 
    const calcularMontoByN = (m) => {
      const totalCopias = calcularTotalCopias(m);
      const precioByN = parseFloat(arrendamiento[0].costoPorCopiaBYN);
      console.log( "costoByN:", precioByN);
      return (totalCopias * precioByN);
    }

    const calcularTotalAAbonar = (m) => {
      const descuentoValor = parseFloat(descuento.current?.value) || 0;
      return (calcularMontoByN(m) - descuentoValor).toFixed(2);
    }
   
    const guardar = () => {
      // hacer un put del arrendamiento actualizando el ultimo contador
      // hacer un put de cada contador, cambiando el estado a confirmado
      // navegar a pagos?
    }


  return (
    
    <div className="contenedor-menu">

<div className="contenedor-secundario">
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
        <td><em>Contador B/N inicial:</em></td>
        <td>{arrendamiento.ultimoContadorBYN || 0}</td>
      </tr>
      <tr>
        <td><em>Contador B/N final:</em></td>
        <td>{m.mensaje}</td>
      </tr>

      {/* Total y Monto a abonar */}
      <tr>
        <td><em>Total copias B/N:</em></td>
        <td>{calcularTotalCopias(m)}</td>

      </tr>
      <tr>
        <td><em>Monto a abonar {m.tipoImpresion === 1 ? "B/N" : "Color"}:</em></td>

        <td>{calcularMontoByN(m)}</td>
      </tr>
      {m.tipoImpresion === 0 && (
        <div>
        <tr>
          <td><em>Contador Color inicial:</em></td>
          <td>{arrendamiento.ultimoContadorColor || 0}</td>
        </tr>
        <tr>
          <td><em>Contador Color final:</em></td>
          <td>{m.mensaje}</td>
        </tr>
      
        <tr>
          <td><em>Total copias color:</em></td>
          <td>{calcularTotalCopias(m)}</td>
        </tr>
        </div>
      )}

      {/* Descuento */}
      <tr>
        <td colSpan="2">
          <label>Descuento:
            <input type="text" className="input-descuento" ref={descuento}/>
          </label>
        </td>
      </tr>
      <tr>
        <td>
          <button onClick={() => calcularTotalAAbonar(m)}>Aplicar descuento</button>
        </td>
      </tr>

      {/* Total y Monto con descuento */}
      {/* <tr>
        <td><em>Total copias con descuento:</em></td>
        <td>xxxxxxx</td>
      </tr> */}
      <tr>
        <td><em>Total a abonar con descuento {m.tipoImpresion === 1 ? "B/N" : "Color"}:</em></td>
        <td>{calcularTotalAAbonar(m)}</td>
      </tr>
    </tbody>
  </table>
</div>

        ))}
        <button onClick={guardar}>Guardar</button>
        <button className='btn-contrasenia'>Enviar a {state.clienteNombre}</button>
    </div>
    </div>
  )
}

export default InformacionContadores