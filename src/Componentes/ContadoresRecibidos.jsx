import React, { useEffect, useState, useRef, useCallback } from 'react';
import ContadorRecibido from './ContadorRecibido';
import { useNavigate, useParams } from 'react-router-dom';

const ContadoresRecibidos = () => {
  const [contadores, setContadores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [arrendamientos, setArrendamientos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  // const [arrendamiento, setArrendamiento] = useState(null);
  const mensajesRef = useRef({});
  const token = localStorage.getItem("token");
  const API_URL=import.meta.env.VITE_API_URL
  const clienteId = useParams();
  const id = Number(clienteId.id)
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  
useEffect(() => {
  const cargarDatos = async () => {
    try {
      const [clientesData, maquinasData, contadoresData] = await Promise.all([
        traerClientes(),
        traerMaquinas(),
        traerContadores()
      ]);

      await traerArrendamientos();

      const agrupados = await agruparEnvios(contadoresData, clientesData, maquinasData); 
      setGrupos(agrupados);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  cargarDatos(); 
}, []);



const traerClientes = async () => {
  const res = await fetch(`${API_URL}/cliente`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Error en clientes");

  const data = await res.json();
  setClientes(data);
  return data;
};

const traerMaquinas = async () => {
  const res = await fetch(`${API_URL}/maquina`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Error en máquinas");

  const data = await res.json();
  setMaquinas(data);
  return data;
};



const traerContadores = async () => {
  const res = await fetch(`${API_URL}/contador`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Error en contadores");

  const data = await res.json();
  setContadores(data);
  return data;
};

const buscarCliente = (id, listaClientes) => {
  const cliente = listaClientes.find(cli => cli.id === id);
  return cliente ? cliente.nombreEmpresa : "Desconocido";
};
const buscarMaquina = (id, listaMaquinas) => {
  const maq = listaMaquinas.find(m => m.id === id);
  return maq ? `${maq.numero} - ${maq.marca} - ${maq.modelo}` : "Desconocida";
};



  const traerArrendamientos = () => {
    fetch(`${API_URL}/Arrendamiento/Arrendamiento/cliente/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => r.ok ? r.json() : Promise.reject("Error en arrendamientos"))
      .then(setArrendamientos)
      .catch(console.error);
  }


const agruparEnvios = async (contadores, clientes, maquinas) => {
  const agrupados = [];

  contadores.forEach((contador) => {
    if (!Array.isArray(contador.enviosContadores)) return;

    contador.enviosContadores.forEach((envio) => {
      const arrendamiento = arrendamientos.find(a =>
        a.maquinaId === envio.maquinaId && a.clienteId === envio.clienteId
      );

      const clave = `${envio.maquinaId}-${envio.clienteId}-${formatearFechaHora(envio.fechaYHora)}`;

      const grupoExistente = agrupados.find(a => a.clave === clave);

      const envioExtendido = {
        ...envio,
        contadorId: contador.id,
        costo: contador.costo,
        costoBYN: arrendamiento?.costoBYN || 0,
        costoColor: arrendamiento?.costoColor || 0,
        clienteNombre: buscarCliente(envio.clienteId, clientes),
        maquinaNombre: buscarMaquina(envio.maquinaId, maquinas),
        fechaFormateada: formatearFechaHora(envio.fechaYHora),
      };

      if (grupoExistente) {
        grupoExistente.envios.push(envioExtendido);
      } else {
        agrupados.push({
          clave,
          contadorId: contador.id,
          costo: 0,
          costoBYN: 0,
          costoColor: 0,
          maquinaId: envio.maquinaId,
          clienteId: envio.clienteId,
          imagen: envio.imagen,
          fecha: envio.fechaYHora,
          clienteNombre: envioExtendido.clienteNombre,
          maquinaNombre: envioExtendido.maquinaNombre,
          fechaFormateada: envioExtendido.fechaFormateada,
          envios: [envioExtendido],
        });
      }
    });
  });

  return agrupados;
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



const handleConfirmar = useCallback((dataGrupo) => {
  navigate(`/informacionContadores/${id}`, { state: dataGrupo });
}, []);

if(clientes.length === 0 || !maquinas.length === 0){
  return <div>Cargando datos...</div>;
}

  return (
    <div className="contenedor-menu">
      <div className="contenedor-secundario">
        <h1>Contadores Recibidos</h1>
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          grupos.map((grupo, i) => (
            <article key={i} className="bloque-contador">
              <ContadorRecibido grupo={grupo} onConfirmar={handleConfirmar} />
            </article>
          ))
        )}

      </div>
    </div>
  );
};

export default ContadoresRecibidos;



