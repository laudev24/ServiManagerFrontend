import React from 'react'
import { parseISO, format } from "date-fns";


const Solicitud = ({ solicitud }) => {
  const formatearFechaHora = (fecha) => {
    
  if (!fecha) return "Fecha no disponible";
  try {
    return format(parseISO(fecha), "dd/MM/yyyy HH:mm");
  } catch {
    return "Fecha inválida";
  }
};

  return (
   <article className="tarjeta-solicitud">
  <h2>{solicitud.cliente.nombreEmpresa}</h2>

  <p><strong>Descripción:</strong></p>
  <p> {solicitud.descripcion}</p>

  <p>
    <strong>Máquina:</strong></p>
    <p> {solicitud.maquina.numero} - 
    {solicitud.maquina.marca} - {solicitud.maquina.modelo}
  </p>

  <p><strong>Fecha de solicitud:</strong></p>
  <p> {formatearFechaHora(solicitud.fecha)}</p>

  {solicitud.imagen && (
    <img 
      src={`data:image/jpeg;base64,${solicitud.imagen}`}
      alt="Imagen de la solicitud"
      className="imagen-contador"
      loading="lazy"
    />
  )}
  
</article>

  );
};

export default Solicitud;