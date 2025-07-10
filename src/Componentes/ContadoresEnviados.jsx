import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


const ContadoresEnviados = () => {
    const token = localStorage.getItem("token");
    const clienteId = localStorage.getItem("clienteId");
   const [contadoresEnviados, setContadoresEnviados] = useState([])

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
            setContadoresEnviados(datos)
          console.log("Contadores enviados:", datos);
        })
        .catch(error => {
          console.error("Error al obtener los contadores enviados:", error);
        });
    }

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

    <table>
      <thead>
        <tr>
          <th>Máquina</th>
          <th>Tipo de Impresión</th>
          <th>Fecha</th>
          <th>Imagen</th>
          <th>Mensaje</th>
        </tr>
      </thead>
      <tbody>
        {contadoresEnviados.map((contador) => (
          <tr key={contador.id}>
            <td>
              {contador.maquina.numero} - {contador.maquina.marca} - {contador.maquina.modelo}
            </td>
            <td>{contador.tipoImpresion}</td>
            <td>{formatearFechaHora(contador.fechaYHora)}</td>
            <td>
              <img
                src={`data:image/jpeg;base64,${contador.imagen}`}
                alt="Imagen enviada"
                className="imagen-contador"
              />
            </td>
            <td>{contador.mensaje}</td>
          </tr>
        ))}
        {contadoresEnviados.length === 0 && (
          <tr>
            <td colSpan="5" style={{ textAlign: "center" }}>
              No hay resultados
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  )
}

export default ContadoresEnviados