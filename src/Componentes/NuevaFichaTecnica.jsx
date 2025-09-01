import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { guardarClientes } from "../features/clientesSlice";
import { guardarMaquinas } from "../features/maquinasSlice";
import { agregarFichaTecnica } from "../features/fichasTecnicasSlice";

const NuevaFichaTecnica = () => {
  const clientes = useSelector((state) => state.clientesSlice.clientes);
  const maquinas = useSelector((state) => state.maquinasSlice.maquinas);
  const token = localStorage.getItem("token");
  const API_URL=import.meta.env.VITE_API_URL

  const [maquina, setMaquina] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [idMaquinaSeleccionada, setIdMaquinaSeleccionada] = useState("");

  const campoIdClienteElegido = useRef("");
  const campoContadorColor1 = useRef("");
  const campoContadorColor2 = useRef("");
  const campoContadorBYN1 = useRef("");
  const campoContadorBYN2 = useRef("");
  const campoDescripcion = useRef("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { from, id } = location.state || {};

  useEffect(() => {

    if (clientes.length === 0) traerClientes();
    if (insumos.length === 0) traerInsumos();
    traerMaquinas();
  }, []);

  const traerClientes = () => {
    fetch(`${API_URL}/cliente`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((datos) => dispatch(guardarClientes(datos)))
      .catch(console.error);
  };

  const traerInsumos = () => {
    fetch(`${API_URL}/insumo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((datos) => setInsumos(datos))
      .catch(console.error);
  };

  const traerMaquinas = () => {
    const url =
      from === "fichasMaquina"
        ? `${API_URL}/maquina/${id}`
        : `${API_URL}/maquina`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((datos) =>
        from === "fichasMaquina"
          ? setMaquina(datos)
          : dispatch(guardarMaquinas(datos))
      )
      .catch(console.error);
  };

  const agregarInsumo = () => {
    setInsumosSeleccionados([...insumosSeleccionados, { insumoId: "", cantidad: 0 }]);
  };

  const actualizarInsumo = (index, campo, valor) => {
    const copia = [...insumosSeleccionados];
    copia[index][campo] = campo === "cantidad" ? Number(valor) : valor;
    setInsumosSeleccionados(copia);
  };

  const eliminarInsumo = (index) => {
    const copia = [...insumosSeleccionados];
    copia.splice(index, 1);
    setInsumosSeleccionados(copia);
  };

  const esColor = () => {
    if (from === "fichasMaquina") return maquina?.tipoImpresion === 0;
    const idSeleccionado = Number(idMaquinaSeleccionada);
    const maquinaSeleccionada = maquinas.find((m) => m.id === idSeleccionado);
    return maquinaSeleccionada?.tipoImpresion === 0;
  };

  const ingresarFicha = () => {
    const ficha = {
      clienteId: Number(campoIdClienteElegido.current.value),
      maquinaId:
        from === "fichasMaquina"
          ? maquina.id
          : Number(idMaquinaSeleccionada),
      fechaYHora: null,
      contadorColor1: esColor() ? Number(campoContadorColor1.current.value) : 0,
      contadorColor2: esColor() ? Number(campoContadorColor2.current.value) : 0,
      contadorBYN1: Number(campoContadorBYN1.current.value),
      contadorBYN2: Number(campoContadorBYN2.current.value),
      descripcion: campoDescripcion.current.value,
      insumos: insumosSeleccionados.map((i) => ({
        insumoId: Number(i.insumoId),
        cantidad: Number(i.cantidad),
      })),
    };

    fetch(`${API_URL}/fichaTecnica`, {
      method: "POST",
      body: JSON.stringify(ficha),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (response.status === 201) {
          const data = await response.json();
          toast("Ficha registrada con éxito");
          dispatch(agregarFichaTecnica(data));
          navigate("/fichasTecnicas");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || "Error al crear ficha");
        }
      })
      .catch((error) => {
        toast.error(error.message);
        console.error(error);
      });
  };


  return (
    <div className="contenedor-menu">
      <div className="contenedor-secundario">
        <h1>Crear Ficha Técnica</h1>

        <select ref={campoIdClienteElegido}>
          <option value="">Elegir empresa</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombreEmpresa}
            </option>
          ))}
        </select>

        {from === "fichasMaquina" ? (
          <p>
            <em>Máquina número:</em> {maquina?.numero}
          </p>
        ) : (
          <select
            value={idMaquinaSeleccionada}
            onChange={(e) => setIdMaquinaSeleccionada(e.target.value)}
          >
            <option value="">Elegir máquina</option>
            {maquinas.map((maquina) => (
              <option key={maquina.id} value={maquina.id}>
                {maquina.numero}
              </option>
            ))}
          </select>
        )}

        <label>
          Contador B&N 1:
          <input type="number" ref={campoContadorBYN1} />
        </label>

        <label>
          Contador B&N 2:
          <input type="number" ref={campoContadorBYN2} />
        </label>

        {esColor() && (
          <>
            <label>
              Contador Color 1:
              <input type="number" ref={campoContadorColor1} />
            </label>

            <label>
              Contador Color 2:
              <input type="number" ref={campoContadorColor2} />
            </label>
          </>
        )}

        <label>Insumos utilizados:</label>
        {insumosSeleccionados.map((item, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}
          >
            <select
              value={item.insumoId}
              onChange={(e) => actualizarInsumo(index, "insumoId", e.target.value)}
            >
              <option value="">Seleccionar insumo</option>
              {insumos.map((insumo) => (
                <option key={insumo.id} value={insumo.id}>
                  {insumo.nombreInsumo}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={item.cantidad}
              min="1"
              onChange={(e) => actualizarInsumo(index, "cantidad", e.target.value)}
              placeholder="Cantidad"
            />
            <button onClick={() => eliminarInsumo(index)}>❌</button>
          </div>
        ))}

        <button onClick={agregarInsumo}>Agregar Insumo</button>

        <label>
          Descripción:
          <textarea ref={campoDescripcion}></textarea>
        </label>

        <input type="button" value="Crear Ficha" onClick={ingresarFicha} />
      </div>
    </div>
  );
};

export default NuevaFichaTecnica;



