import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { guardarFichasTecnicas } from '../features/fichasTecnicasSlice';

const VerFichaTecnica = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const API_URL=import.meta.env.VITE_API_URL
  const fichas = useSelector(state => state.fichasTecnicasSlice.fichasTecnicas);
  const ficha = fichas.find(m => m.id === Number(id));

  useEffect(() => {
    

    if(fichas.length === 0){
      fetch(`${API_URL}/fichaTecnica`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(r => {
        if(!r.ok) throw new Error("Error en la respuesta del servidor");
        return r.json();
      }) 
      .then(datos => dispatch(guardarFichasTecnicas(datos)))
      .catch(error => {
        console.error("Error al obtener las fichas:", error);
      });
    }
  }, [dispatch, fichas.length, navigate, token]);

  if (!ficha) {
    return <p>Cargando ficha o ficha no encontrada...</p>;
  }

  const formatearFechaHora = (fechaISO) => {
    if(!fechaISO) return "";
    const fecha = new Date(fechaISO); 
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  };

  return (
    <div className="contenedor-menu">
      <div className="ficha-detalle">
        <h1>Ficha Técnica nro. {id}</h1>

        <Link to={`/modificarFicha/${id}`}>Modificar ficha</Link>

        <table>
          <tbody>
            <tr>
              <th>Nombre de la empresa:</th>
              <td data-label="Empresa">{ficha.cliente?.nombreEmpresa || "No definido"}</td>
            </tr>
            <tr>
              <th>Máquina número:</th>
              <td data-label="Máquina">{ficha.maquina?.numero || "No definido"}</td>
            </tr>
            <tr>
              <th>Fecha:</th>
              <td data-label="Fecha">{formatearFechaHora(ficha.fechaYHora)}</td>
            </tr>
            <tr>
              <th>Contador BYN 1:</th>
              <td data-label="BYN1">{ficha.contadorBYN1 ?? "No definido"}</td>
            </tr>
            <tr>
              <th>Contador BYN 2:</th>
              <td data-label="BYN2">{ficha.contadorBYN2 ?? "No definido"}</td>
            </tr>
            <tr>
              <th>Contador Color 1:</th>
              <td data-label="Color1">{ficha.contadorColor1 ?? "No definido"}</td>
            </tr>
            <tr>
              <th>Contador Color 2:</th>
              <td data-label="Color2">{ficha.contadorColor2 ?? "No definido"}</td>
            </tr>
            <tr>
              <th>Insumos:</th>
              <td data-label="Insumos">
                {ficha.insumos && ficha.insumos.length > 0 ? (
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {ficha.insumos.map((item, index) => (
                      <li key={index}>
                        {item.insumo?.nombreInsumo || "Insumo no definido"} - Cantidad: {item.cantidad}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>No hay insumos registrados</span>
                )}
              </td>
            </tr>
            <tr>
              <th>Descripción:</th>
              <td data-label="Descripción">{ficha.descripcion || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerFichaTecnica;
