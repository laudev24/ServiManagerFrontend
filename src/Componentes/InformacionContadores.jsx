import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const InformacionContadores = () => {
  const { state } = useLocation();
  console.log("state: ",state)
  const navigate = useNavigate();
  const { id: clienteIdParam } = useParams();
  const clienteId = Number(clienteIdParam);

  const maquinaId = state?.maquinaId;
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;

  const [contadores, setContadores] = useState([]);
  const [contador, setContador] = useState(null);
  const [arrendamiento, setArrendamiento] = useState(null);
  const [arrendamientos, setArrendamientos] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [descuento, setDescuento] = useState(0);
  const [loading, setLoading] = useState(true);
  const descuentoRef = useRef(0);

  useEffect(() => {
    if (!clienteId) return;

    const fetchData = async () => {
      await traerContadoresDelCliente();
      await traerCliente();
    };

    fetchData();
  }, [clienteId, maquinaId]);

  useEffect(() => {
    if (state?.maquinaId) {
      traerArrendamiento();
    } else {
      traerArrendamientosDelCliente();
    }
  }, []);

  const traerContadoresDelCliente = async () => {
    try {
      console.log("clienteId en traerContadoresDelCliente: ", clienteId)
      const res = await fetch(`${API_URL}/contador/cliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Error al traer contadores');
      const data = await res.json();
      setContadores(data);
      console.log("data contadores: ", data)
      // console.log("maquinaId: ", maquinaId)
        let index = -1;

      if(maquinaId!==undefined) {
        for (let i = data.length - 1; i >= 0; i--) {
          const c = data[i];
          if (
            Number(c.enviosContadores[0].clienteId) === Number(clienteId) &&
            ( Number(c.enviosContadores[0].maquinaId) === Number(maquinaId))
          ) {
            index = i;
            break;
          }
        }
      }
      console.log("index encontrado: ", index)

      if (index !== -1) setContador(data[index]);
      else {
        const index = data.length - 1;
        if (index !== -1) setContador(data[index]);
        // console.log("index alternativo encontrado: ", index)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const traerCliente = async () => {
    try {
      const res = await fetch(`${API_URL}/cliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al traer cliente');
      const data = await res.json();
      setCliente(data);
    } catch (error) {
      console.error(error);
    }
  };

  const traerArrendamiento = async () => {
    try {
      const res = await fetch(
        `${API_URL}/arrendamiento/maquina/${maquinaId}/cliente/${clienteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Error al traer arrendamiento');
      const data = await res.json();
      const a = Array.isArray(data) ? data[0] : data;
      setArrendamiento(a ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const traerArrendamientosDelCliente = async () => {
    try {
      const res = await fetch(`${API_URL}/arrendamiento/arrendamiento/cliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al traer arrendamientos del cliente');
      const data = await res.json();
      setArrendamientos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFechaHora = (fechaISO) => {
    if (!fechaISO) return '';
    const fechaUTC = new Date(fechaISO);
    const fechaLocal = new Date(fechaUTC.getTime() - 3 * 60 * 60 * 1000);
    return fechaLocal.toLocaleString('es-AR');
  };

  const traerTipoImpresion = (tipo) => {
    return tipo === 'Monocromatico' ? 'B/N' : 'Color';
  };

  const traerContador = (i) => {
    const envio = contador.enviosContadores[i];
    const arr = arrendamientos.find(
      (a) => a.maquinaId === envio.maquinaId && a.clienteId === clienteId
    );
    return envio.tipoImpresion === 'Monocromatico'
      ? arr?.ultimoContadorBYN ?? 0
      : arr?.ultimoContadorColor ?? 0;
  };

  const calcularTotalDeCopias = (i) => {
    const inicial = traerContador(i);
    const final = Number(contador.enviosContadores[i].mensaje);
    return final - inicial;
  };

  const traerMonto = (i) => {
    console.log("costoBYN: ", contador.costoBYN)
    console.log("costoColor: ", contador.costoColor)
    return contador.enviosContadores[i].tipoImpresion === 'Monocromatico'
      ? contador.costoBYN
      : contador.costoColor;
  };

 const calcularTotalAAbonar = () => {
  return (contador?.costo ?? 0) - descuento;
};


  const calcularTotalCopias = (m) => {
    const arr = arrendamiento || arrendamientos.find(
      (a) => a.maquinaId === maquinaId && a.clienteId === clienteId
    );
    const inicial =
      m.tipoImpresion === 'Monocromatico'
        ? arr?.ultimoContadorBYN ?? 0
        : arr?.ultimoContadorColor ?? 0;
    const final = Number(m.mensaje) || 0;
    return Math.max(final - inicial, 0);
  };

  const traerMontoAAbonar = (m) => {
    console.log("m: ", m)
     console.log("costoBYN: ", contador.costoBYN)
    console.log("costoColor: ", contador.costoColor)
    return m.tipoImpresion === 'Monocromatico' ? contador.costoBYN : contador.costoColor;
  };

  const guardar = async () => {
    // Guardar lógica aquí
  };

  const enviarACliente = () => {
    // TODO: lógica de envío
  };
console.log(loading)
  console.log("contador: ", contador)
  if (loading || !contador) return <p>Cargando datos...</p>;
  if (!arrendamiento) return <p>No se encontró arrendamiento.</p>;

  return (
    <div className="contenedor-menu">
      <div className="contenedor-secundario">
        <h1>{state?.clienteNombre || cliente?.nombreEmpresa}</h1>
        <h2>{state?.maquinaNombre || contador.enviosContadores[0].maquinaNumero}</h2>
        <p>{state?.fechaFormateada || formatearFechaHora(contador.fechaYHora)}</p>

        {state?.mensajes?.length > 0 ? (
          state.mensajes.map((m, i) => (
            <div key={i} className="tabla-resumen">
              <h3>{traerTipoImpresion(m.tipoImpresion)}</h3>
              <table>
                <tbody>
                  <tr>
                    <td><em>Contador {traerTipoImpresion(m.tipoImpresion)} inicial:</em></td>
                    <td>{calcularTotalCopias(m)}</td>
                  </tr>
                  <tr>
                    <td><em>Contador {traerTipoImpresion(m.tipoImpresion)} final:</em></td>
                    <td>{m.mensaje}</td>
                  </tr>
                  <tr>
                    <td><em>Monto a abonar {traerTipoImpresion(m.tipoImpresion)}:</em></td>
                    <td>{traerMontoAAbonar(m)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <div className="tabla-resumen">
            {contador.enviosContadores.map((envio, i) => (
              <table key={i}>
                <tbody>
                  <tr>
                    <td><em>Contador {traerTipoImpresion(contador.enviosContadores[i].tipoImpresion)} inicial:</em></td>
                    <td>{traerContador(i)}</td>
                  </tr>
                  <tr>
                    <td><em>Contador {traerTipoImpresion(contador.enviosContadores[i].tipoImpresion)} final:</em></td>
                    <td>{envio.mensaje}</td>
                  </tr>
                  <tr>
                    <td><em>Total de copias {traerTipoImpresion(contador.enviosContadores[i].tipoImpresion)}:</em></td>
                    <td>{calcularTotalDeCopias(i)}</td>
                  </tr>
                  <tr>
                    <td><em>Monto a abonar {traerTipoImpresion(contador.enviosContadores[i].tipoImpresion)}:</em></td>
                    <td>{traerMonto(i)}</td>
                  </tr>
                </tbody>
              </table>
            ))}
          </div>
        )}

        <table>
          <tbody>
            <tr>
              <td><strong>Total a abonar sin descuento:</strong></td>
              <td>{contador.costo}</td>
            </tr>
           <tr>
            <td colSpan="2">
              <label>Descuento:
                <input
                  type="number"
                  className="input-descuento"
                  // value={descuento}
                  onChange={(e) => setDescuento(Number(e.target.value) || 0)}
                />
              </label>
            </td>
          </tr>
            <tr>
              <td><strong>Total con descuento:</strong></td>
              <td>{calcularTotalAAbonar()}</td>
            </tr>
          </tbody>
        </table>

        <button onClick={guardar}>Guardar</button>
        <button className="btn-contrasenia" onClick={enviarACliente}>Enviar a {state?.clienteNombre}</button>
      </div>
    </div>
  );
};

export default InformacionContadores;


