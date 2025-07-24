import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


const ContadoresEnviados = () => {
    const token = localStorage.getItem("token");
    const clienteId = localStorage.getItem("clienteId");
   const [contadoresEnviados, setContadoresEnviados] = useState([])
const [loading, setLoading] = useState(true);

    let navigate = useNavigate();

    useEffect(() => {
      if (!localStorage.getItem("token")) 
        navigate("/")
     if (localStorage.getItem("esAdmin") === "true")
        navigate("/InicioAdm")
     traerContadoresEnviados()
    }, [])

    const traerContadoresEnviados = () => {

      fetch(`https://localhost:5201/api/envioContador/cliente/${clienteId}`,
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
        if (!agrupados[key]) {
          agrupados[key] = {
            maquina: contador.maquina,
            fechaYHora: formatearFechaHora(contador.fechaYHora),
            imagen: contador.imagen,
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
        const fecha = new Date(fechaISO); // convierte desde UTC a local automáticamente
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
    }

  return (
   <div className="contenedor-menu">
  <div className="formulario-cliente">
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
    {contadoresEnviados.map((grupo, index) => (
      <tr key={index}>
        <td>
          {grupo.maquina.numero} - {grupo.maquina.marca} - {grupo.maquina.modelo}
        </td>
        <td>{grupo.fechaYHora}</td>
        <td>
          <img
            loading="lazy"
            src={`data:image/jpeg;base64,${grupo.imagen}`}
            alt="Imagen enviada"
            className="imagen-contador"
            style={{ maxWidth: '100px', height: 'auto' }}
          />
        </td>
        <td>
          {grupo.mensajes.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
              {grupo.mensajes.map((msg, idx) => (
                <li key={idx}>
                  <strong>{msg.tipoImpresion === 1 ? "B/N" : "Color"}:</strong> {msg.mensaje}
                </li>
              ))}
            </ul>
          ) : (
            <em>Sin valores ingresados</em>
          )}
        </td>
      </tr>
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