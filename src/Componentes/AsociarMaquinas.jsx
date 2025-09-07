import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { guardarMaquinas } from '../features/maquinasSlice';

const AsociarMaquinas = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token")
  const API_URL=import.meta.env.VITE_API_URL

  const maquinas = useSelector(state => state.maquinasSlice.maquinas);
  const [idMaquinaElegida, setIdMaquinaElegida] = useState("")
  const [maquinaElegida, setMaquinaElegida] = useState(null)
  const [maquinasAsociadas, setMaquinasAsociadas] = useState([])
  const [maquinasSinAsociar, setMaquinasSinAsociar] = useState([])
  const [cliente, setCliente] = useState(null)

  const campoCargoFijo = useRef("")
  const campoCostoColor = useRef("")
  const campoCostoBYN = useRef("")
  const campoUltimoContadorBYN = useRef("")
  const campoUltimoContadorColor = useRef("")

  useEffect(() => {

    if (!maquinas.length) cargarMaquinas()
    if (!maquinasAsociadas.length) traerMaquinasDelCliente()
    traerCliente()
  }, [maquinas]);

  useEffect(() => {
    cargarMaquinasSinAsociar()
  }, [maquinas, maquinasAsociadas])

  const cargarMaquinas = () => {
    fetch(`${API_URL}/maquina`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => r.json())
      .then(datos => dispatch(guardarMaquinas(datos)))
      .catch(error => console.error("Error al obtener las maquinas:", error));
  }

  const traerMaquinasDelCliente = () => {
    fetch(`${API_URL}/cliente/maquinas-del-cliente?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => r.json())
      .then(setMaquinasAsociadas)
      .catch(error => console.error("Error al obtener las maquinas:", error));
  }

  const cargarMaquinasSinAsociar = () => {
    const lista = maquinas.filter((maq) =>
      !maquinasAsociadas.some((asociada) => asociada.id === maq.id)
    );
    setMaquinasSinAsociar(lista);
    console.log("Maquinas sin asociar:", lista);
  };

  const traerCliente = () => {
    fetch(`${API_URL}/cliente/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => r.json())
      .then(setCliente)
      .catch(error => console.error("Error al obtener al cliente:", error));
  }

  const mostrarFormulario = (e) => {
    const id = e.target.value;
    setIdMaquinaElegida(id);
    const maquina = maquinas.find(m => m.id === Number(id));
    setMaquinaElegida(maquina);
  };

  const asociar = () => {
    const arrendamiento = {
      clienteId: Number(id),
      maquinaId: idMaquinaElegida,
      fechaInicio: null,
      fechaFin: null,
      activo: null,
      cargoFijo: parseFloat(campoCargoFijo.current.value.replace(',', '.')),
      costoPorCopiaBYN: campoCostoBYN.current?.value
    ? parseFloat(campoCostoBYN.current.value.replace(',', '.'))
    : null,
      costoPorCopiaColor: maquinaElegida?.tipoImpresion === "Color" &&
    campoCostoColor.current?.value
    ? parseFloat(campoCostoColor.current.value.replace(',', '.'))
    : null,
      ultimoContadorBYN: Number(campoUltimoContadorBYN.current?.value) ?? null,
      ultimoContadorColor: maquinaElegida?.tipoImpresion === "Color"
        ? Number(campoUltimoContadorColor.current?.value) : null
        
    }

    fetch(`${API_URL}/arrendamiento`, {
      method: 'POST',
      body: JSON.stringify(arrendamiento),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((response) => {
        if (response.status === 201) {
          toast("Máquina asociada con éxito")
          traerMaquinasDelCliente()
          setIdMaquinaElegida("")
          setMaquinaElegida(null)
          cargarMaquinasSinAsociar()
        } else {
          response.json().then(data => {
            toast("Error: " + (data?.message ?? "Desconocido"))
          })
        }
      })
      .catch((error) => {
        toast(error.message);
      });
  }

  if (!cliente) return <p>Cargando datos...</p>;

  return (
    <div className="contenedor-menu">
      <div className="contenedor-secundario">
        <h1>Asociar Máquina al Cliente {cliente.nombreEmpresa}</h1>

        <select value={idMaquinaElegida} onChange={mostrarFormulario}>
          {maquinaElegida &&
            <option value={maquinaElegida.id}>{maquinaElegida.numero} - {maquinaElegida.marca} - {maquinaElegida.modelo}</option>
          }
          {!maquinaElegida &&
            <option value="">Elegí una máquina</option>
          }
          {maquinasSinAsociar.map((maquina) => (
            <option key={maquina.id} value={maquina.id}>
              {maquina.numero} - {maquina.marca} - {maquina.modelo}
            </option>
          ))}
          {maquinasSinAsociar.length === 0 && (
            <option key="">No hay máquinas para mostrar.</option>
          )}
        </select>

        <label>
          Cargo fijo:
          <input type="text" ref={campoCargoFijo} />
        </label>

        
        <label>
          Costo por Copia B/N:
          <input type="text" ref={campoCostoBYN} />
        </label>

          <label>
          Último Contador B/N:
          <input type="text" ref={campoUltimoContadorBYN} />
        </label>

        
        {maquinaElegida?.tipoImpresion === "Color" && (
          <>
            <label>
              Costo por Copia Color:
              <input type="text" ref={campoCostoColor} />
            </label>
            <label>
              Último Contador Color:
              <input type="text" ref={campoUltimoContadorColor} />
            </label>
          </>
        )}

        
      

        <input type="button" value="Asociar Máquina" onClick={asociar} />

        <h2>Máquinas asociadas:</h2>
        <table>
          <tbody>
            {maquinasAsociadas.map((maquina) => (
              <tr key={maquina.id}>
                <td>
                  {maquina.numero} - {maquina.marca} - {maquina.modelo}
                </td>
              </tr>
            ))}
            {maquinasAsociadas.length === 0 && (
              <tr>
                <td>No hay máquinas asociadas a este cliente.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AsociarMaquinas
