import { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'


const ModificarMaquina = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  const [maquina, setMaquina] = useState("")
  const [numero, setNumero] = useState("")
  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [anio, setAnio] = useState("")
  const [tipoMaquina, setTipoMaquina] = useState("")
  const [tipoImpresion, setTipoImpresion] = useState("")
  const [cantidadContadores, setCantidadContadores] = useState("")

  useEffect(() => {
    fetch(`https://localhost:5201/api/maquina/${id}`)
    .then(r =>{
      if(!r.ok){
          throw new Error("Error en la respuesta del servidor");
      }
      return r.json()
      }) 
    .then(datos => {
      setMaquina(datos)
    })
    .catch(error => {
      console.error("Error al obtener la máquina:", error);
    })
    setNumero(maquina.numero)
    setMarca(maquina.marca)
    setModelo(maquina.modelo)
    setAnio(maquina.año)
    setTipoMaquina(maquina.tipo)
    setTipoImpresion(maquina.tipoImpresion)
    setCantidadContadores(maquina.cantidadContadores)
  }, [maquina])
  
  const modificar = () => {
    const maquinaModificada = {
      id: Number(id),
      activa: maquina.activa,
      numero: numero,
      marca: marca,
      modelo: modelo,
      año: anio,
      tiposImpresion: tipoImpresion,
      tiposMaquina: tipoMaquina,
      cantidadContadores: Number(cantidadContadores),
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
    .then(r =>{
      if(!r.ok){
          throw new Error("Error en la respuesta del servidor");
      }
        navigate("/maquinas")
        toast("Máquina modificada con éxito.")
      return r.json()
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
                <input type="text" className="numero" onChange={(e) => setNumero(e.target.value)} value={numero || ''}/>
              </label><br/>
              <label>Marca:
                <input type="text" className="marca" onChange={(e) => setMarca(e.target.value)} value={marca || ''}/>
              </label><br/>
              <label>Modelo:
                <input type="text" className="modelo" onChange={(e) => setModelo(e.target.value)} value={modelo || ''}/>
              </label><br/>
              <label>Año:
                <input type="text" className="anio" onChange={(e) => setAnio(e.target.value)} value={anio || ''}/>
              </label><br/>
               <label>Tipo de máquina:
                <input type="text" className="tipoMaquina" onChange={(e) => setTipoMaquina(e.target.value)} value={tipoMaquina || ''}/>
              </label><br/>
              <label>Tipo de impresión:
                <input type="text" className="tipoImpresion" onChange={(e) => setTipoImpresion(e.target.value)} value={tipoImpresion || ''}/>
              </label><br/>
              {/* 
              <select className="tipoMaquina" onChange={(e) => setTipoMaquina(e.target.value)} value={tipo || ''}>
                {tiposMaquina.map((tm) => (
                  <option key={tm.id}>{tm.nombre}</option>
                ))}
                {tiposMaquina.length===0 && <option key="">No hay tipos de máquina para mostrar</option>}
              </select><br/>
            
              <select className="tipoImpresion" onChange={(e) => setTipoImpresion(e.target.value)} value={tipoImpresion}>
                {tiposImpresion.map((ti) => (
                  <option key={ti.id}>{ti.nombre}</option>
                ))}
                {tiposImpresion.length===0 && <option key="">No hay tipos de impresión para mostrar</option>}
              </select><br/> */}
              <label>Cantidad de contadores:
                <input type="text" className="cantidadContadores" onChange={(e) => setCantidadContadores(e.target.value)} value={cantidadContadores || ''}/>
              </label><br/>
              
              <input type="button" value="Modificar Máquina" onClick={modificar}/>
      </div>
  )
}

export default ModificarMaquina