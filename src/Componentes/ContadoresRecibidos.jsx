import React, { useEffect, useState, useRef, useCallback } from 'react';
import ContadorRecibido from './ContadorRecibido';
import { useNavigate } from 'react-router-dom';

const ContadoresRecibidos = () => {
  const [contadores, setContadores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const mensajesRef = useRef({});
  const token = localStorage.getItem("token");
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
useEffect(() => {
  Promise.all([traerClientes(), traerMaquinas(), traerContadores()])
    .then(() => setLoading(false))
    .catch(console.error);
}, []);




  const traerClientes = () => {
    fetch("https://localhost:5201/api/cliente", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => r.ok ? r.json() : Promise.reject("Error en clientes"))
      .then(setClientes)
      .catch(console.error);
  };

  const traerMaquinas = () => {
    fetch("https://localhost:5201/api/maquina", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => r.ok ? r.json() : Promise.reject("Error en maquinas"))
      .then(setMaquinas)
      .catch(console.error);
  };

  const traerContadores = () => {
    fetch("https://localhost:5201/api/contador", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => r.ok ? r.json() : Promise.reject("Error en contadores"))
      .then(setContadores)
      .catch(console.error);
  };

  const buscarCliente = useCallback((idCliente) => {
    const cliente = clientes.find(cli => cli.id === idCliente);
    return cliente ? cliente.nombreEmpresa : "Desconocido";
  }, [clientes]);

  const buscarMaquina = useCallback((idMaquina) => {
    const maq = maquinas.find(m => m.id === idMaquina);
    return maq ? `${maq.numero} - ${maq.marca} - ${maq.modelo}` : "Desconocida";
  }, [maquinas]);

const agruparEnvios = (contadores) => {
  const agrupados = [];

  contadores.forEach((contador) => {
    contador.enviosContadores.forEach((envio) => {
      
      const clave = `${envio.maquinaId}-${envio.clienteId}-${formatearFechaHora(envio.fechaYHora)}`;

      const grupoExistente = agrupados.find(g => g.clave === clave);

      const envioExtendido = {
        ...envio,
        clienteNombre: buscarCliente(envio.clienteId),
        maquinaNombre: buscarMaquina(envio.maquinaId),
        fechaFormateada: formatearFechaHora(envio.fechaYHora),
      };

      if (grupoExistente) {
        grupoExistente.envios.push(envioExtendido);
      } else {
        agrupados.push({
          clave,
          maquinaId: envio.maquinaId,
          clienteId: envio.clienteId,
          imagen: envio.imagen,
          fecha: envio.fechaYHora,
          clienteNombre: buscarCliente(envio.clienteId),
          maquinaNombre: buscarMaquina(envio.maquinaId),
          fechaFormateada: formatearFechaHora(envio.fechaYHora),
          envios: [envioExtendido],
        });
      }
    });
  });

  
  return agrupados

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


  const handleMensajeChange = useCallback((envioId, texto) => {
    mensajesRef.current[envioId] = texto;
  }, []);



const handleConfirmar = useCallback((dataGrupo) => {
  navigate('/informacionContadores', { state: dataGrupo });
}, []);


  return (
    <div className="contenedor-menu">
      <div className="formulario-cliente">
        <h1>Contadores Recibidos</h1>
    {contadores.length > 0 ? (
  agruparEnvios(contadores).map((grupo, i) => (
    <article key={i} className="bloque-contador">
      <ContadorRecibido
        grupo={grupo}
        // onMensajeChange={handleMensajeChange}
        // mensajes={mensajesRef.current} 
        onConfirmar={handleConfirmar}
      />
    </article>
  ))
) : (
  <p>Cargando datos o no hay contadores...</p>
)}

      </div>
    </div>
  );
};

export default ContadoresRecibidos;



