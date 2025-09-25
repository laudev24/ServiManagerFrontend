import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { agregarFichaTecnica } from "../features/fichasTecnicasSlice";

const NuevaFichaTecnica = () => {
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  const [maquina, setMaquina] = useState(null);         
  const [maquinas, setMaquinas] = useState([]);          
  const [clientes, setClientes] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [arrendamientos, setArrendamientos] = useState([]);

  const [campoClienteElegidoId, setCampoClienteElegidoId] = useState("");
  const [campoMaquinaElegidaId, setCampoMaquinaElegidaId] = useState("");

  const [maquinasFiltradas, setMaquinasFiltradas] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  const [loading, setLoading] = useState(true);

  const campoContadorColor1 = useRef("");
  const campoContadorColor2 = useRef("");
  const campoContadorBYN1 = useRef("");
  const campoContadorBYN2 = useRef("");
  const campoDescripcion = useRef("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { from, id } = location.state || {};

  // Carga inicial
  useEffect(() => {
    traerClientes();
    traerInsumos();
    traerMaquinas();
    traerArrendamientos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const traerClientes = async () => {
    try {
      const r = await fetch(`${API_URL}/cliente`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const datos = await r.json();
      setClientes(datos);
      setClientesFiltrados(datos); // estado inicial
    } catch (e) {
      console.error(e);
    }
  };

  const traerInsumos = async () => {
    try {
      const r = await fetch(`${API_URL}/insumo`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const datos = await r.json();
      setInsumos(datos);
    } catch (e) {
      console.error(e);
    }
  };

  const traerMaquinas = async () => {
    try {
      const url = from === "fichasMaquina" ? `${API_URL}/maquina/${id}` : `${API_URL}/maquina`;
      const r = await fetch(url, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const datos = await r.json();
      if (from === "fichasMaquina") {
        setMaquina(datos); // una sola máquina fija
      } else {
        setMaquinas(datos);
        setMaquinasFiltradas(datos); // estado inicial
      }
    } catch (e) {
      console.error(e);
    }
  };

  const traerArrendamientos = async () => {
    try {
      const res = await fetch(`${API_URL}/arrendamiento`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al traer arrendamientos");
      const data = await res.json();

      if (from === "fichasMaquina" && id) {
        const maquinaIdNum = Number(id);
        setArrendamientos(data.filter((a) => a.maquinaId === maquinaIdNum));
        setLoading(false);
      } else {
        console.log("arrendamientos totales:", data);
        setArrendamientos(data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Filtrar máquinas al elegir cliente
  useEffect(() => {
    if (from === "fichasMaquina") return; // no hay select de máquinas en este flujo
    if (campoClienteElegidoId) {
      console.log("arrendamientos:", arrendamientos);
      const clienteIdNum = Number(campoClienteElegidoId);
      const arrCliente = arrendamientos.filter((a) => a.clienteId === clienteIdNum);
      console.log("arrCliente:", arrCliente);
      const maquinasCliente = maquinas.filter((m) => arrCliente.some((a) => a.maquinaId === m.id));
      console.log("maquinasCliente:", maquinasCliente);
      setMaquinasFiltradas(maquinasCliente);
      // si la máquina seleccionada no pertenece, la vacío
      if (campoMaquinaElegidaId && !maquinasCliente.some((m) => m.id === Number(campoMaquinaElegidaId))) {
        setCampoMaquinaElegidaId("");
      }
    } else {
      setMaquinasFiltradas(maquinas);
    }
  }, [campoClienteElegidoId, maquinas, arrendamientos, from, campoMaquinaElegidaId]);

  // Filtrar clientes al elegir máquina (o cuando vienes desde ficha de máquina)
  useEffect(() => {
    if (from === "fichasMaquina" && id) {
      const maquinaIdNum = Number(id);
      const arrMaq = arrendamientos.filter((a) => a.maquinaId === maquinaIdNum);
      const clientesDeMaq = clientes.filter((c) => arrMaq.some((a) => a.clienteId === c.id));
      setClientesFiltrados(clientesDeMaq);
      // Si hay uno solo, puedes autoseleccionarlo (opcional):
      // setCampoClienteElegidoId(clientesDeMaq.length === 1 ? String(clientesDeMaq[0].id) : "");
      return;
    }

    if (campoMaquinaElegidaId) {
      const maqIdNum = Number(campoMaquinaElegidaId);
      const arrMaq = arrendamientos.filter((a) => a.maquinaId === maqIdNum);
      const cli = clientes.filter((c) => arrMaq.some((a) => a.clienteId === c.id));
      setClientesFiltrados(cli);
      // si el cliente seleccionado no pertenece, lo vacío
      if (campoClienteElegidoId && !cli.some((c) => c.id === Number(campoClienteElegidoId))) {
        setCampoClienteElegidoId("");
      }
    } else {
      setClientesFiltrados(clientes);
    }
  }, [campoMaquinaElegidaId, clientes, arrendamientos, from, id, campoClienteElegidoId]);

  const agregarInsumo = () => {
    setInsumosSeleccionados((prev) => [...prev, { insumoId: "", cantidad: 0 }]);
  };

  const actualizarInsumo = (index, campo, valor) => {
    setInsumosSeleccionados((prev) => {
      const copia = [...prev];
      copia[index][campo] = campo === "cantidad" ? Number(valor) : valor;
      return copia;
    });
  };

  const eliminarInsumo = (index) => {
    setInsumosSeleccionados((prev) => prev.filter((_, i) => i !== index));
  };

  const esColor = () => {
    if (from === "fichasMaquina") return maquina?.tipoImpresion === "Color";
    const idSeleccionado = Number(campoMaquinaElegidaId);
    const maquinaSeleccionada = maquinas.find((m) => m.id === idSeleccionado);
    return maquinaSeleccionada?.tipoImpresion === "Color";
  };

  const ingresarFicha = () => {
    const clienteIdNum = Number(campoClienteElegidoId);
    const maquinaIdNum =
      from === "fichasMaquina" ? Number(maquina?.id) : Number(campoMaquinaElegidaId);

    if (!clienteIdNum || !maquinaIdNum) {
      toast.error("Debes seleccionar cliente y máquina.");
      return;
    }

    const ficha = {
      clienteId: clienteIdNum,
      maquinaId: maquinaIdNum,
      fechaYHora: null,
      contadorColor1: esColor() ? Number(campoContadorColor1.current.value || 0) : 0,
      contadorColor2: esColor() ? Number(campoContadorColor2.current.value || 0) : 0,
      contadorBYN1: Number(campoContadorBYN1.current.value || 0),
      contadorBYN2: Number(campoContadorBYN2.current.value || 0),
      descripcion: campoDescripcion.current.value || "",
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

  if (loading && arrendamientos.length === 0) {  
    return <div>Cargando...</div>;
  }
  return (
    <div className="contenedor-menu">
      <div className="contenedor-secundario">
        <h1>Crear Ficha Técnica</h1>

        {/* Select de CLIENTE (siempre visible, pero filtrado) */}
        <select
          value={campoClienteElegidoId}
          onChange={(e) => setCampoClienteElegidoId(e.target.value)}
        >
          <option value="">Elegir empresa</option>
          {clientesFiltrados.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombreEmpresa}
            </option>
          ))}
          {clientesFiltrados.length === 0 && (
            <option value="">No hay clientes vinculados</option>
          )}
        </select>

        {/* Select de MÁQUINA (oculto si vienes desde ficha de máquina) */}
        {from === "fichasMaquina" ? (
          <p>
            <em>Máquina número:</em> {maquina?.numero}
          </p>
        ) : (
          <select
            value={campoMaquinaElegidaId}
            onChange={(e) => setCampoMaquinaElegidaId(e.target.value)}
          >
            <option value="">Elegir máquina</option>
            {maquinasFiltradas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.numero} - {m.marca} - {m.modelo}
              </option>
            ))}
            {maquinasFiltradas.length === 0 && (
              <option value="">No hay máquinas vinculadas</option>
            )}
          </select>
        )}

        <label>
          Contador B/N 1:
          <input type="number" ref={campoContadorBYN1} />
        </label>

        <label>
          Contador B/N 2:
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



