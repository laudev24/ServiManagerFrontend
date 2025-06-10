import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { guardarMaquinas } from '../features/maquinasSlice';

const AsociarMaquinas = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    
    const clientes = useSelector(state => state.clientesSlice.clientes);
    const maquinas = useSelector(state => state.maquinasSlice.maquinas);
    
    const campoIdMaquinaElegida = useRef("")
    const campoCargoFijo = useRef("")
    const campoCostoColor = useRef("")
    const campoCostoBYN = useRef("")

    const cliente = clientes.find(c => c.id === Number(id))
    // const maquinaElegida = maquinas.find(c => c.id === Number(campoIdMaquinaElegida))
    const maquinasAsociadas = []
    // const mostrarFormulario = () => {
        
    // }

     useEffect(() => {
          fetch("https://localhost:5201/api/maquina")
          .then(r =>{
                if(!r.ok){
                    throw new Error("Error en la respuesta del servidor");
                }
                return r.json()
                })
          .then(datos => {
              dispatch(guardarMaquinas(datos))
    
          })
          .catch(error => {
              console.error("Error al obtener las maquinas:", error);
          })
      }, [])

    const asociar = () => {
        const idMaquina = Number(campoIdMaquinaElegida.current.value);
        const maquinaElegida = maquinas.find(m => m.id === idMaquina);

        const arrendamiento = {
            clienteId : Number(id),
            maquinaId : idMaquina,
            fechaInicio : null,
            fechaFin : null,
            activo : null,
            cargoFijo : campoCargoFijo.current.value,
            costoPorCopiaBYN : campoCostoBYN.current?.value ?? null,
            costoPorCopiaColor : campoCostoColor.current?.value ?? null
        }
        console.log("Enviando: " + JSON.stringify(arrendamiento))
        fetch("https://localhost:5201/api/arrendamiento", {
                method: 'POST',
                body: JSON.stringify(arrendamiento),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                })
                .then((response) => response.json())
                .then((datos) => {
                    console.log(datos.codigo)
                    if(datos.codigo===201 || datos.codigo == undefined ){
                        console.log(datos.mensaje);
                        toast("Máquina asociada con éxito.")
                        console.log(cliente)
                    }
                    else {
                        console.log(datos.mensaje)
                        toast(datos.mensaje);
                    }
                })
                // .then(async (response) => {
                //     const responseBody = await response.json();
                //     console.log("Status real:", response.status);
                //     console.log("Body:", responseBody);
                //     return responseBody;
                // })
                .catch((error) => {
                    console.error("Error al asociar máquina: ", error.message); // usa correctamente "error"
                    toast("Error al asociar máquina.");
                });
    }

  return (
    <div>
        <h1>Asociar Máquinas al Cliente {cliente.nombreEmpresa}</h1>
      
        <select className="maquinas" ref={campoIdMaquinaElegida} /*onChange={mostrarFormulario}*/ >
            <option value="">Elegir máquina</option>
            {maquinas.map((maquina) => (
                <option key={maquina.id} value={maquina.id}>{maquina.numero} - {maquina.marca} - {maquina.modelo}</option>
            ))}
            {maquinas.length===0 && <option key="">No hay máquinas para mostrar.</option>}
        </select><br />
        <label>Cargo fijo:
            <input type="text" className='cargoFijo' ref={campoCargoFijo}/>
        </label><br />
        {/* {maquinaElegida?.tipoImpresion == 'Color' && 
        <label>Costo por Copia Color:
            <input type="text" className='costoColor' ref={campoCostoColor}/>
        </label>}
        {maquinaElegida?.tipoImpresion == 'B&N' && 
        <label>Costo por Copia B&N:
            <input type="text" className='costoBYN' ref={campoCostoBYN}/>
        </label>} */}
        <input type="button" value="Asociar Máquina" onClick={asociar}/><br />
        <h2>Máquinas asociadas:</h2>
        <table>
            <tr>
                {maquinasAsociadas.map((maquina) => (
                <td key={maquina.id}>{maquina.numero} - {maquina.marca} - {maquina.modelo}</td>
                ))}
                {maquinasAsociadas.length===0 && <td key="">No hay máquinas asociadas a este cliente.</td>}
            </tr>
        </table>
    </div>
  )
}

export default AsociarMaquinas