import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


const ContadoresEnviados = () => {
    const token = localStorage.getItem("token");
    const API_URL=import.meta.env.VITE_API_URL
    const clienteId = localStorage.getItem("clienteId");
   const [contadoresEnviados, setContadoresEnviados] = useState([])
const [loading, setLoading] = useState(true);

    let navigate = useNavigate();

    useEffect(() => {
  
     traerContadoresEnviados()
    }, [])

    const traerContadoresEnviados = () => {

      fetch(`${API_URL}/contador/cliente/${clienteId}/pendiente`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`
          }
        })
        .then(async r => {
          const contentType = r.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await r.json();
            if (!r.ok) {
              throw new Error(data.message || data.error || "Error en la respuesta del servidor");
            }
            return data;
          } else {
            throw new Error("La respuesta no es JSON");
          }
        })
        .then(datos => {
          const datosAgrupados = agruparContadores(datos);
          setContadoresEnviados(datosAgrupados);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al obtener los contadores enviados:", error);
        });
    }

    const agruparContadores = (contadores) => {
      const agrupados = {};
      contadores.forEach((contador) => {
        const key = `${contador.maquina.id}-${formatearFechaHora(contador.fechaYHora)}`;
        // console.log(contador.imagen)
        const blob = new Blob([Uint8Array.from(atob(contador.imagen), c => c.charCodeAt(0))], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);

        if (!agrupados[key]) {
          agrupados[key] = {
            maquina: contador.maquina,
            fechaYHora: formatearFechaHora(contador.fechaYHora),
            imagen: url,
            mensajes: [],
          };
        }
        if (contador.mensaje?.trim()) {
          agrupados[key].mensajes.push({
            tipoImpresion: contador.tipoImpresion,
            mensaje: contador.mensaje,
          });
        }
      });
      return Object.values(agrupados);
    };

  


   const formatearFechaHora = (fechaISO) => {
  if (!fechaISO) return "";

  const fechaUTC = new Date(fechaISO);

  // Obtener la hora local ajustando desde UTC
  const fechaLocal = new Date(fechaUTC.getTime() - 3 * 60 * 60 * 1000);

  const dia = String(fechaLocal.getDate()).padStart(2, '0');
  const mes = String(fechaLocal.getMonth() + 1).padStart(2, '0');
  const anio = fechaLocal.getFullYear();
  const horas = String(fechaLocal.getHours()).padStart(2, '0');
  const minutos = String(fechaLocal.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
};

    const Row = React.memo(({ grupo }) => (
  <tr>
    <td>{grupo.maquina.numero} - {grupo.maquina.marca}</td>
    <td>{grupo.fechaYHora}</td>
    <td>
      <img src={grupo.imagen} loading="lazy" width={100} alt="img" />
    </td>
    <td>
      {grupo.mensajes.map((msg, idx) => (
        <div key={idx}>
          <strong>{msg.tipoImpresion === "Monocromatico" ? "B/N" : "Color"}:</strong> {msg.mensaje} 
        </div>
      ))}
    </td>
  </tr>
))

  return (
   <div className="contenedor-menu">
  <div className="contenedor-secundario">
    <h1>Contadores enviados</h1>
    {loading ? (
  <p>Cargando datos...</p>
) : (
<table>
  <thead>
    <tr>
      <th>Máquina</th>
      <th>Fecha</th>
      <th>Imagen</th>
      <th>Valor del contador</th>
    </tr>
  </thead>
  <tbody>
  {contadoresEnviados.map((grupo, i) => (
    <Row key={i} grupo={grupo} />
  ))}


    {contadoresEnviados.length === 0 && (
      <tr>
        <td colSpan="4" style={{ textAlign: "center" }}>
          No hay resultados
        </td>
      </tr>
    )}
  </tbody>
</table>)}
  </div>
</div>

  )
}

export default ContadoresEnviados