import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { agregarMaquina } from '../features/maquinasSlice'
import { useDispatch, useSelector } from 'react-redux'

const NuevaMaquina = () => {
  const tokenSelector = useSelector(state => state.usuarioSlice.token)
  // const [token, setToken] = useState("")
  const token = localStorage.getItem("token")


  const campoNumero = useRef("")
  const campoMarca = useRef("")
  const campoModelo = useRef("")
  const campoAnio = useRef("")
  const campoTipoMaquina = useRef("")
  const campoTipoImpresion = useRef("")
  const campoCantidadContadores = useRef("")

  const [tiposMaquina, setTiposMaquina] = useState([])
  const [tiposImpresion] = useState([
    { id: 0, nombre: "Color" },
    { id: 1, nombre: "Monocromatico" }
  ]);

  const dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token"))
      navigate("/")
    if (localStorage.getItem("esAdmin") === "false") {
      navigate("/inicio")
    }

  }, [])


  const registrar = () => {
    const maquinaNueva = {
      numero: campoNumero.current.value,
      marca: campoMarca.current.value,
      modelo: campoModelo.current.value,
      año: campoAnio.current.value,
      activa: true,
      tipoImpresion: parseInt(campoTipoImpresion.current.value),
      cantidadContadores: Number(campoCantidadContadores.current.value),
    };

    console.log("Datos a enviar:", maquinaNueva);

    fetch("https://localhost:5201/api/maquina", {
      method: 'POST',
      body: JSON.stringify(maquinaNueva),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${token}`

      },
    })
      .then(async r => {
        const contentType = r.headers.get("content-type");
        const status = r.status;

        if (contentType && contentType.includes("application/json")) {
          const data = await r.json();

          if (!r.ok) {
            const message = data.message || data.error || "Error en la respuesta del servidor";
            const inner = data.innerException?.message;
            const fullMessage = inner ? `${message} | ${inner}` : message;

            toast.error(fullMessage);
            throw new Error(fullMessage);
          }

          return { data, status };
        } else {
          const text = await r.text();
          if (!r.ok) {
            toast.error(text || "Error en la respuesta del servidor");
            throw new Error(text || "Error en la respuesta del servidor");
          }
          throw new Error("Respuesta inesperada del servidor");
        }
      })
      .then(({ data, status }) => {
        toast.success("Máquina creada con éxito.");
        dispatch(agregarMaquina(data));
        navigate("/maquinas");

      });
  }


  return (
    <div className="contenedor-menu">

      <div className="formulario-cliente">
        <h1>Registro de nueva máquina</h1>

        <label>
          Número:
          <br />
          <input type="text" ref={campoNumero} />
        </label>

        <label>
          Marca:
          <br />
          <input type="text" ref={campoMarca} />
        </label>

        <label>
          Modelo:
          <br />
          <input type="text" ref={campoModelo} />
        </label>

        <label>
          Año:
          <br />
          <input type="text" ref={campoAnio} />
        </label>

        <label>
          Tipo de impresión:
          <select className="tipoImpresion" ref={campoTipoImpresion}>
            <option value="">Tipo de impresión</option>
            {tiposImpresion.map((ti) => (
              <option key={ti.id} value={ti.id}>{ti.nombre}</option>
            ))}
          </select>

        </label>

        <label>
          Cantidad de contadores:
          <input type="text" ref={campoCantidadContadores} />
        </label>

        <input type="button" value="Registrar Máquina" onClick={registrar} />
      </div>
    </div>
  )
}

export default NuevaMaquina