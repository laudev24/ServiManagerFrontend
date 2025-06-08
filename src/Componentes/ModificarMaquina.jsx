import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guardarMaquinas } from '../features/maquinasSlice'
import { useNavigate } from 'react-router-dom'



const ModificarMaquina = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const maquinas = useSelector(state => state.maquinasSlice.maquinas);
  const maquina = maquinas.find(m => m.id === Number(id))
  // const tiposMaquina = useSelector(state => state.tiposMaquinaSlice.maquinas);
  // const tiposImpresion = useSelector(state => state.tiposImpresionSlice.maquinas);



  const campoNumero = useRef("")
  const campoMarca = useRef("")
  const campoModelo = useRef("")
  const campoAnio = useRef("")
  const campoTipoMaquina = useRef("")
  const campoTipoImpresion = useRef("")
  const campoCantidadContadores = useRef("")

  const modificar = () => {
    const maquinaModificada = {
      id: Number(id),
      activa: maquina.activa,
      numero: campoNumero.current.value,
      marca: campoMarca.current.value,
      modelo: campoModelo.current.value,
      año: campoAnio.current.value,
      tiposImpresion: campoTipoImpresion.current.value,
      tiposMaquina: campoTipoMaquina.current.value,
      cantidadContadores: Number(campoCantidadContadores.current.value),
    };

    console.log("Datos a enviar:", maquinaModificada);
    console.log("maquina original:", maquina);

    fetch(`https://localhost:5201/api/maquina/${id}`, {
      method: 'PUT',
      body: JSON.stringify(maquinaModificada),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json())
    .then((datos) => {
      console.log(datos.codigo)
      if(datos.codigo===undefined || datos.codigo===200){ // el codigo que llega es undefined
        dispatch(guardarMaquinas(datos))
        navigate("/maquinas")
        // console.log("Entre por el codigo undefined") // Si se descomenta muestra este mensaje 
        console.log(datos.codigo);
        toast("Máquina modificada con éxito.")
      }
      else {
        console.log("No entre por el codigo undefined")
        console.log(datos.codigo)
        toast(datos.mensaje);
        // toast("Hasta aca llegue")
      }
    })
    .catch((error) => {
      console.log("Error")
      console.error("Error al modificar máquina:", error.message);
      toast("Error al modificar máquina.");
    });
  }
  

  return (
    <div>
       <h1>Modificar máquina</h1>
              <label>Número:
                <input type="text" className="numero" ref={campoNumero} defaultValue={maquina?.numero || ''}/>
              </label><br/>
              <label>Marca:
                <input type="text" className="marca" ref={campoMarca} defaultValue={maquina?.marca || ''}/>
              </label><br/>
              <label>Modelo:
                <input type="text" className="modelo" ref={campoModelo} defaultValue={maquina?.modelo || ''}/>
              </label><br/>
              <label>Año:
                <input type="text" className="anio" ref={campoAnio} defaultValue={maquina?.año || ''}/>
              </label><br/>
               <label>Tipo de máquina:
                <input type="text" className="tipoMaquina" ref={campoTipoMaquina} defaultValue={maquina?.tipo || ''}/>
              </label><br/>
              <label>Tipo de impresión:
                <input type="text" className="tipoImpresion" ref={campoTipoImpresion} defaultValue={maquina?.tipoImpresion || ''}/>
              </label><br/>
              {/* 
              <select className="tipoMaquina" ref={campoTipoMaquina} defaultValue={maquina?.tipo || ''}>
                {tiposMaquina.map((tm) => (
                  <option key={tm.id}>{tm.nombre}</option>
                ))}
                {tiposMaquina.length===0 && <option key="">No hay tipos de máquina para mostrar</option>}
              </select><br/>
            
              <select className="tipoImpresion" ref={campoTipoImpresion} defaultValue={maquina?.tipoImpresion}>
                {tiposImpresion.map((ti) => (
                  <option key={ti.id}>{ti.nombre}</option>
                ))}
                {tiposImpresion.length===0 && <option key="">No hay tipos de impresión para mostrar</option>}
              </select><br/> */}
              <label>Cantidad de contadores:
                <input type="text" className="cantidadContadores" ref={campoCantidadContadores} defaultValue={maquina?.cantidadContadores || ''}/>
              </label><br/>
              
              <input type="button" value="Modificar Máquina" onClick={modificar}/>
      </div>
  )
}

export default ModificarMaquina