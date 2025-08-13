import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { guardarFichasTecnicas } from "../features/fichasTecnicasSlice";
import { modificarFichaTecnica } from "../features/fichasTecnicasSlice";
import { guardarInsumos } from "../features/insumosSlice";

const ModificarFicha = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL

  const fichasTecnicas = useSelector(
    (state) => state.fichasTecnicasSlice.fichasTecnicas
  );

  const insumos = useSelector(
    (state) => state.insumosSlice.insumos
  );

  const [ficha, setFicha] = useState(null);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);

  const campoDescripcion = useRef();
  const campoContadorColor1 = useRef();
  const campoContadorColor2 = useRef();
  const campoContadorBYN1 = useRef();
  const campoContadorBYN2 = useRef();

  useEffect(() => {
    if (fichasTecnicas.length === 0) {
      fetch(`${API_URL}/fichaTecnica`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => dispatch(guardarFichasTecnicas(data)))
        .catch((err) => console.error(err));
    }

    if (insumos.length === 0) {
      fetch(`${API_URL}/insumo`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => dispatch(guardarInsumos(data)))
        .catch((err) => console.error(err));
    }
  }, [dispatch, token]);


  useEffect(() => {
    if (fichasTecnicas.length === 0) return;

    const fichaEncontrada = fichasTecnicas.find((f) => f.id === Number(id));
    if (fichaEncontrada) {
      setFicha(fichaEncontrada);

      if (Array.isArray(fichaEncontrada.insumos) && fichaEncontrada.insumos.length > 0) {
        setInsumosSeleccionados(
          fichaEncontrada.insumos.map((i) => ({
            insumoId: Number(i.insumoId),
            cantidad: Number(i.cantidad),
          }))
        );
      } else {
        setInsumosSeleccionados([]);
      }
    }
  }, [fichasTecnicas, id]);

  const actualizarInsumo = (index, campo, valor) => {
    const copia = [...insumosSeleccionados];
    copia[index][campo] =
      campo === "cantidad" || campo === "insumoId" ? Number(valor) : valor;
    setInsumosSeleccionados(copia);
  };

  const agregarInsumo = () => {
    setInsumosSeleccionados([
      ...insumosSeleccionados,
      { insumoId: "", cantidad: 1 },
    ]);
  };

  const eliminarInsumo = (index) => {
    setInsumosSeleccionados(insumosSeleccionados.filter((_, i) => i !== index));
  };

  const modificarFicha = () => {
    if (!ficha) return;

    const fichaModificada = {
      ...ficha,
      descripcion: campoDescripcion.current.value,
      contadorColor1: Number(campoContadorColor1.current.value) || 0,
      contadorColor2: Number(campoContadorColor2.current.value) || 0,
      contadorBYN1: Number(campoContadorBYN1.current.value) || 0,
      contadorBYN2: Number(campoContadorBYN2.current.value) || 0,
      insumos: insumosSeleccionados.map((i) => ({
        insumoId: Number(i.insumoId),
        cantidad: Number(i.cantidad),
      })),
    };

    fetch(`${API_URL}/fichaTecnica/${ficha.id}`, {
      method: "PUT",
      body: JSON.stringify(fichaModificada),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Ficha técnica modificada con éxito");
          dispatch(modificarFichaTecnica(fichaModificada));
          navigate("/fichasTecnicas");
        } else {
          toast.error("Error al modificar la ficha");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error de conexión");
      });
  };

  if (!ficha) return <p>Cargando ficha técnica...</p>;

  return (
    <div>
      <h2>Modificar Ficha Técnica</h2>
      <label>Descripción:</label>
      <input
        type="text"
        defaultValue={ficha.descripcion}
        ref={campoDescripcion}
      />

      <label>Contador Color 1:</label>
      <input
        type="number"
        defaultValue={ficha.contadorColor1}
        ref={campoContadorColor1}
      />

      <label>Contador Color 2:</label>
      <input
        type="number"
        defaultValue={ficha.contadorColor2}
        ref={campoContadorColor2}
      />

      <label>Contador BYN 1:</label>
      <input
        type="number"
        defaultValue={ficha.contadorBYN1}
        ref={campoContadorBYN1}
      />

      <label>Contador BYN 2:</label>
      <input
        type="number"
        defaultValue={ficha.contadorBYN2}
        ref={campoContadorBYN2}
      />

      <h3>Insumos</h3>
      {insumos.length === 0 ? (
        <p>Cargando insumos...</p>
      ) : (
        insumosSeleccionados.map((item, index) => {
          const insumoCompleto = insumos.find(i => i.id === item.insumoId);

          return (
            <div key={index}>
              <select
                value={item.insumoId}
                onChange={(e) => actualizarInsumo(index, "insumoId", e.target.value)}
              >
                <option value="">Seleccionar insumo</option>
                {insumos.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nombreInsumo || i.nombre}
                  </option>
                ))}
              </select>

              <span>
                {insumoCompleto ? insumoCompleto.nombreInsumo || insumoCompleto.nombre : "Insumo no disponible"}
              </span>

              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) => actualizarInsumo(index, "cantidad", e.target.value)}
                placeholder="Cantidad"
              />
              <button type="button" onClick={() => eliminarInsumo(index)}>
                ❌
              </button>
            </div>
          );
        })
      )}
      <button type="button" onClick={agregarInsumo}>
        Agregar Insumo
      </button>

      <br />
      <button onClick={modificarFicha}>Guardar Cambios</button>
    </div>
  );
};

export default ModificarFicha;



