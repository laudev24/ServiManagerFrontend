import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ModificarMaquina = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_URL=import.meta.env.VITE_API_URL

  const [maquina, setMaquina] = useState(null);
  const [numero, setNumero] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [tipoImpresion, setTipoImpresion] = useState(0);
  const [cantidadContadores, setCantidadContadores] = useState("");

  useEffect(() => {
    if (!maquina) {
      traerMaquina();
    }
  }, [maquina, navigate]);

  const traerMaquina = () => {
    fetch(`${API_URL}/maquina/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => {
        if (!r.ok) throw new Error("Error en la respuesta del servidor");
        return r.json();
      })
      .then(datos => {
        setMaquina(datos);
        setNumero(datos.numero || "");
        setMarca(datos.marca || "");
        setModelo(datos.modelo || "");
        setAnio(datos.año || "");
        const tipoImpresionNum =
          typeof datos.tipoImpresion === 'number'
            ? datos.tipoImpresion
            : datos.tipoImpresion === "Color"
              ? 0
              : 1;
        setTipoImpresion(tipoImpresionNum);
        setCantidadContadores(
          datos.cantidadContadores !== null && datos.cantidadContadores !== undefined
            ? datos.cantidadContadores.toString()
            : ""
        );
      })
      .catch(error => {
        console.error("Error al obtener la máquina:", error);
        toast.error("Error al cargar datos de la máquina.");
      });
  };

  const modificar = () => {
    const maquinaModificada = {
      id: Number(id),
      activa: maquina?.activa ?? true,
      numero,
      marca,
      modelo,
      año: anio,
      tipoImpresion: Number(tipoImpresion),
      cantidadContadores: Number(cantidadContadores),
    };

    fetch(`${API_URL}/maquina/${id}`, {
      method: 'PUT',
      body: JSON.stringify(maquinaModificada),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => {
        if (!r.ok) throw new Error("Error en la respuesta del servidor");
        toast.success("Máquina modificada con éxito.");
        navigate("/maquinas");
        return r.json();
      })
      .catch(error => {
        console.error("Error al modificar máquina:", error);
        toast.error("Error al modificar máquina.");
      });
  };

  return (
    <div className="contenedor-menu">
      <div className="contenedor-secundario">
        <h1>Modificar máquina</h1>

        <label>
          Número:
          <input
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </label>

        <label>
          Marca:
          <input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </label>

        <label>
          Modelo:
          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
          />
        </label>

        <label>
          Año:
          <input
            type="text"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
          />
        </label>

        <label>
          Tipo de impresión:
          <select
            value={tipoImpresion}
            onChange={(e) => setTipoImpresion(Number(e.target.value))}
          >
            <option value={0}>Color</option>
            <option value={1}>Monocromático</option>
          </select>
        </label>

        <label>
          Cantidad de contadores:
          <input
            type="text"
            value={cantidadContadores}
            onChange={(e) => setCantidadContadores(e.target.value)}
          />
        </label>

        <input type="button" value="Modificar Máquina" onClick={modificar} />
      </div>
    </div>
  );
};

export default ModificarMaquina;