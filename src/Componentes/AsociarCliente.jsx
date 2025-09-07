import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { guardarClientes } from '../features/clientesSlice';

const AsociarCliente = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const token = localStorage.getItem("token")
    const API_URL=import.meta.env.VITE_API_URL
    let navigate = useNavigate();
        
    const clientes = useSelector(state => state.clientesSlice.clientes);
    const [clientesAsociados, setClientesAsociados] = useState([])
    const [maquina, setMaquina] = useState("")
    const [clientesNoAsociados, setClientesNoAsociados] = useState([])
    
    const campoIdClienteElegido = useRef("")
    const campoCargoFijo = useRef("")
    const campoCostoColor = useRef("")
    const campoCostoBYN = useRef("")
    const campoUltimoContadorBYN = useRef("")
    const campoUltimoContadorColor = useRef("")

      useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        if (!clientes.length) {
          await cargarClientes();
        }
        await Promise.all([
          cargarMaquina(),
          cargarClientesAsociadosYFiltrar()
        ]);
      } catch (error) {
        console.error("Error en la carga inicial:", error);
      }
    };

    cargarDatosIniciales();
  }, []);

    // useEffect(() => {
    //     if(!clientes.length) cargarClientes()
    //     cargarClientesAsociados()
    //     cargarMaquina()

    // }, [])

    const cargarMaquina = () => {
        fetch(`${API_URL}/maquina/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
        })
        .then(r =>{ 
            if(!r.ok){
                throw new Error("Error en la respuesta del servidor");
            }
            return r.json()
            }
        ) 
        .then(datos => {
            setMaquina(datos)
        })
        .catch(error => {
            console.error("Error al obtener la máquina:", error);
        })
      }

    const cargarClientes = () => {
        fetch(`${API_URL}/cliente`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
        .then(r =>{
            if(!r.ok){
                throw new Error("Error en la respuesta del servidor");
            }
            return r.json()
            })
        .then(datos => {
            dispatch(guardarClientes(datos))

        })
        .catch(error => {
            console.error("Error al obtener los clientes:", error);
        })
    }
     const cargarClientesAsociadosYFiltrar = async () => {
    try {
      const response = await fetch(`${API_URL}/arrendamiento/arrendamiento/maquina/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Error al obtener arrendamientos");

      const arrendamientos = await response.json();
      const asociados = arrendamientos.map(a => a.cliente);

      setClientesAsociados(asociados);

      const asociadosIds = new Set(asociados.map(c => c.id));
      const noAsociados = clientes.filter(c => !asociadosIds.has(c.id));
      setClientesNoAsociados(noAsociados);
    } catch (error) {
      console.error("Error al obtener los clientes asociados:", error);
    }
  };
    // const cargarClientesAsociados = () => {
    //     fetch(`${API_URL}/arrendamiento/arrendamiento/maquina/${id}`, {
    //         method: 'GET',
    //         headers: {
    //           'Content-Type': 'application/json',
    //            'Authorization': `Bearer ${token}`
    //         }
    //     })
    //     .then(r =>{
    //         if(!r.ok){
    //             throw new Error("Error en la respuesta del servidor");
    //         }
    //         return r.json()
    //     }) 
    //     .then(datos => {
    //         const arrendamientos = datos;
    //         const nuevosAsociados = arrendamientos.map(a => a.cliente);
    //         setClientesAsociados(nuevosAsociados);

    //         const asociadosIds = new Set(nuevosAsociados.map(c => c.id));
    //         const noAsociados = clientes.filter(c => !asociadosIds.has(c.id));
    //         setClientesNoAsociados(noAsociados);
    //     console.log(noAsociados)

    //     })

            // const arrendamientos = datos
            // setClientesAsociados(arrendamientos.map((a => a.cliente)))
            // setearClientesNoAsociados()
        // })
    //     .catch(error => {
    //         console.error("Error al obtener los clientes:", error);
    //     })
    // }
    // const setearClientesNoAsociados = () => {
    //     const clientesAsociadosIds = new Set(clientesAsociados.map(c => c.id));
    //     const noAsociados = clientes.filter(c => !clientesAsociadosIds.has(c.id));
    //     setClientesNoAsociados(noAsociados);
    // }
 
    const asociar = async () => {
  const idCliente = Number(campoIdClienteElegido.current.value)
        const arrendamiento = {
            clienteId : idCliente,
            maquinaId : Number(id),
            fechaInicio : null,
            fechaFin : null,
            // activo : null,
            cargoFijo : parseFloat(campoCargoFijo.current.value.replace(',', '.')),
            costoPorCopiaBYN : campoCostoBYN.current?.value
    ? parseFloat(campoCostoBYN.current.value.replace(',', '.'))
    : null,
             costoPorCopiaColor: maquina.tipoImpresion === "Color" &&
    campoCostoColor.current?.value
    ? parseFloat(campoCostoColor.current.value.replace(',', '.'))
    : null,
    ultimoContadorBYN: Number(campoUltimoContadorBYN.current?.value) ?? null,
      ultimoContadorColor: maquina?.tipoImpresion === "Color"
        ? Number(campoUltimoContadorColor.current?.value) : null
        }
        console.log("Enviando: " + JSON.stringify(arrendamiento))

  try {
    const response = await fetch(`${API_URL}/arrendamiento`, {
      method: 'POST',
      body: JSON.stringify(arrendamiento),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${token}`,
      },
    });

    const clone = response.clone();

    if (!response.ok) {
      // Intentamos parsear como JSON
      try {
        const errorJson = await response.json();
        toast(`Error del servidor: ${errorJson.message || JSON.stringify(errorJson)}`);
        console.error("Error JSON del backend:", errorJson);
      } catch (parseErr) {
        // No es JSON, lo leemos en texto
        const text = await clone.text();
        toast(`Error del servidor: ${text}`);
        console.error("Error texto del backend:", text);
      }
      return;
    }

    const data = await response.json();
    toast("Cliente asociado con éxito");
    await cargarClientesAsociadosYFiltrar();
  } catch (error) {
    console.error("Error al realizar la petición:", error);
    toast("Error en la petición al servidor.");
  }
};


    // const asociar = () => {
    //   // console.log(campoIdClienteElegido.current.value)
    //     const idCliente = Number(campoIdClienteElegido.current.value)
    //     const arrendamiento = {
    //         clienteId : idCliente,
    //         maquinaId : Number(id),
    //         fechaInicio : null,
    //         fechaFin : null,
    //         // activo : null,
    //         cargoFijo : parseFloat(campoCargoFijo.current.value.replace(',', '.')),
    //         costoPorCopiaBYN : campoCostoBYN.current?.value
    // ? parseFloat(campoCostoBYN.current.value.replace(',', '.'))
    // : null,
    //          costoPorCopiaColor: maquina.tipoImpresion === "Color" &&
    // campoCostoColor.current?.value
    // ? parseFloat(campoCostoColor.current.value.replace(',', '.'))
    // : null,
    //     }
    //     console.log("Enviando: " + JSON.stringify(arrendamiento))
     

    //     fetch(`${API_URL}/arrendamiento`, {
    //         method: 'POST',
    //         body: JSON.stringify(arrendamiento),
    //         headers: {
    //             'Content-type': 'application/json; charset=UTF-8',
    //            'Authorization': `Bearer ${token}`
    //         },
    //     })
    //     .then((response) => {
    //         response.json()
    //         console.log(response)
    //         if(response.status===201){
    //             toast("Cliente asociado con exito")
    //             cargarClientesAsociados()
    //         }
    //     })
    //     .catch((error) => {
    //         console.error("Error al asociar cliente: ", error.message); 
    //         toast("Error al asociar cliente.");
    //     });
    // }


  return (
    <div className="contenedor-menu">

<div className="contenedor-secundario">
  <h1>Asociar Clientes a la Máquina {maquina.numero}</h1>

  <select ref={campoIdClienteElegido}>
    <option value="">Elegir cliente</option>
    {clientesNoAsociados.map((cliente) => (
      <option key={cliente.id} value={cliente.id}>{cliente.nombreEmpresa}</option>
    ))}
    {clientesNoAsociados.length === 0 && (
      <option key="">No hay clientes para mostrar.</option>
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

     {maquina?.tipoImpresion === "Color" && (
      <div>

      <label>
        Costo por Copia Color:
        <input type="text" ref={campoCostoColor} />
      </label>

      <label>
            Último Contador Color:
            <input type="text" ref={campoUltimoContadorColor} />
      </label>
    </div>
  )}
  

  <input type="button" value="Asociar Cliente" onClick={asociar} />

  <h2>Clientes asociados:</h2>

  <table>
    <tbody>
      {clientesAsociados.map((cliente) => (
        <tr key={cliente.id}>
          <td>{cliente.nombreEmpresa}</td>
        </tr>
      ))}
      {clientesAsociados.length === 0 && (
        <tr>
          <td>No hay clientes asociados a esta máquina.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>
</div>
  )
}

export default AsociarCliente