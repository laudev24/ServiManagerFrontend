import React, { useEffect, useRef, useState } from 'react'
import Camara from './Camara'
import GaleriaFotos from './GaleriaFotos'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


const EnviarContador = () => {

    let navigate = useNavigate();
    const dispatch = useDispatch();

    const [showCamera1, setShowCamera1] = React.useState(false);
    const [showCamera2, setShowCamera2] = React.useState(false);
    const [galeria1, setGaleria1] = useState(false);
    const [galeria2, setGaleria2] = useState(false);
    const [fotoMon, setFotoMon] = useState(null);
    const [fotoCol, setFotoCol] = useState(null);
    const [modoActivo, setModoActivo] = useState(null); // 'camara' o 'galeria'
    const [maquinasAsociadas, setMaquinasAsociadas] = useState([]);
    const [tipoContador, setTipoContador] = useState(1);

    const numeroBYN = useRef(null);
    const numeroColor = useRef(null);

    const clienteId = useSelector(state => state.clienteSlice.clienteId);
    const token = localStorage.getItem("token");

    useEffect(() => {
     if (!localStorage.getItem("token")) 
        navigate("/");
     if (localStorage.getItem("esAdmin") === "true")
        navigate("/InicioAdm");
     setModoActivo(''); 
        traerMaquinasDelCliente();
    }, [])

       const traerMaquinasDelCliente = () => {
        console.log("Traer maquinas del cliente con ID:", clienteId);
        if (!clienteId) 
            traerClienteId();
     fetch(`https://localhost:5201/api/cliente/maquinas-del-cliente?id=${clienteId}`, {
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
            setMaquinasAsociadas(datos)
        })
        .catch(error => {
        console.error("Error al obtener las maquinas:", error);
        })

    }

    const traerClienteId = () => {
        const nombre = localStorage.getItem("nombre");
        fetch(`https://localhost:5201/api/cliente/usuario?nombre=${nombre}`, {
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
            
            dispatch(guardarClienteId(datos.id));
        })
        .catch(error => {
            console.error("Error al obtener el cliente:", error);
        })
    }

    const setContador = () => {
        const maquinaId = Number(document.querySelector('select').value); // Obtengo el ID
        const maquina = maquinasAsociadas.find(maq => maq.id === maquinaId);
        if (maquina.tipoImpresion === 0) {
            setTipoContador(0); // Tipo de contador: 0 para color
        } else {    
            setTipoContador(1); // Tipo de contador: 1 para B&N
        }
    }
        
    

    const handlePhotoData = (photoData) => {
        console.log("Foto a enviar photodata:", photoData);
        //Primero voy a mandar el envio y luego hago el fetch de la foto para ponerlo en los otros componentes
        // if(photoData) dispatch(guardarFotos(photoData)); // Guardo la foto porque la tengo que mostrar en el chat del cliente y en "verContadores" del administrador
        setFotoMon(photoData) // Actualizo el estado de la foto para mostrarla en el componente
        
        return( <img src={fotoMon} alt="Foto a enviar" /> )
    };

      const handlePhotoData2 = (photoData) => {
        console.log("Foto a enviar photodata:", photoData);
        //Primero voy a mandar el envio y luego hago el fetch de la foto para ponerlo en los otros componentes
        // if(photoData) dispatch(guardarFotos(photoData)); // Guardo la foto porque la tengo que mostrar en el chat del cliente y en "verContadores" del administrador
        setFotoCol(photoData) // Actualizo el estado de la foto para mostrarla en el componente
        return( <img src={fotoCol} alt="Foto a enviar" /> )
    };

    const enviarContador = () => {
        const valorBYN = numeroBYN.current.value;

        const maquinaId = Number(document.querySelector('select').value); // Obtengo el ID de la máquina seleccionada
        const maquina = maquinasAsociadas.find(maq => maq.id === maquinaId);
       
        const contadorByn = {  
            "id": 0,
            "clienteId": clienteId,
            "maquinaId": maquinaId,
            "fechaYHora": null,
            "confirmado": true,
            "contador": 0,
            "tipoImpresion": 1,
            "mensaje": valorBYN
        }
         
        if ( maquina.tipoImpresion === 0){
            if(!fotoCol || !fotoMon){
                toast("Debe tomar una foto o seleccionar una de la galería para enviar el contador");
                return;
            } 
        }
         if(!fotoMon){
            toast("Debe tomar una foto o seleccionar una de la galería para enviar el contador");
            return;
        }
            console.log(token)

        const formData = new FormData();

        formData.append("EnviosContadores[0].EnvioContador", new Blob([JSON.stringify(contadorByn)], { type: "application/json" }));
        formData.append("EnviosContadores[0].Imagen", fotoMon);
        
       if(maquina.tipoImpresion === 0){
            const valorColor = numeroColor.current.value;
            const contadorColor = {  
                "id": 0,
                "clienteId": clienteId,
                "maquinaId": maquinaId,
                "fechaYHora": "",
                "confirmado": true,
                "contador": 0,
                "tipoImpresion": 0,
                "imagen": "",
                "mensaje": valorColor
            }
            formData.append("EnviosContadores[1].EnvioContador", new Blob([JSON.stringify(contadorColor)], { type: "application/json" }));
            formData.append("EnviosContadores[1].Imagen", fotoCol);
            console.log("Datos a enviar:", formData);
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }
            fetch(`https://localhost:5201/api/envioContador`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(r => {
                if(!r.ok){
                    console.error("Error en la respuesta del servidor:", r.statusText);
                    toast.error("Error en la respuesta del servidor");
                    throw new Error("Error en la respuesta del servidor", r);
                }
                return r.json();
            })
            .catch(error => {
                console.error("Error al enviar el contador:", error);
                toast(error.message || "Error al enviar el contador");
            })
        }
        else if(maquina.tipoImpresion === 1){
            for (let [key, value] of formData.entries()) {
    if (value instanceof File && value.type === "application/json") {
        const reader = new FileReader();
        reader.onload = () => {
            console.log(`📤 POSTMAN KEY: ${key}`);
            console.log(`🧾 TYPE: JSON (application/json)`);
            console.log(`📦 VALUE:\n${reader.result}`);
            console.log('---------------------------');
        };
        reader.readAsText(value);
    } else if (value instanceof File) {
        console.log(`📤 POSTMAN KEY: ${key}`);
        console.log(`🖼️ TYPE: ${value.type}`);
        console.log(`📎 FILENAME: ${value.name}`);
        console.log('---------------------------');
    } else {
        console.log(`📤 POSTMAN KEY: ${key}`);
        console.log(`📝 VALUE: ${value}`);
        console.log('---------------------------');
    }
}

            for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }
            fetch(`https://localhost:5201/api/envioContador`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(r => {
                if(!r.ok){
                    console.error("Error en la respuesta del servidor:", r.statusText);
                    toast.error("Error en la respuesta del servidor");
                    throw new Error("Error en la respuesta del servidor", r);
                }
                return r.json();
            })
            .catch(error => {
                console.error(error);
                toast(error.message || "Error al enviar el contador");
            })
        }
        

    }

    
  return (
    <div className="contenedor-menu">
        <div className="formulario-cliente">
            <h1>Enviar Contador</h1>
            <label>
                Selecciona la máquina:
                <select onChange={setContador} defaultValue="">
                    {maquinasAsociadas.map((maq) => (
                    <option key={maq.id} value={maq.id}>
                        {maq.numero} - {maq.marca} - {maq.modelo}
                    </option>
                    ))}
                </select>
            </label>
            <label>
                Contador B&N:
                <div>
                    <div>
                        <button onClick={() => [setShowCamera1(!showCamera1), setModoActivo('camara')]}>
                            {showCamera1 ? 'Cerrar Cámara' : 'Abrir Cámara'}
                        </button>
                        {showCamera1 && <Camara activo={modoActivo === 'camara'} onPhotoTaken={handlePhotoData} onData={(data) => handlePhotoData(data)} />}
                    </div>
                    <div>
                        <button onClick={() => [setGaleria1(!galeria1), setModoActivo('galeria')]}>
                            {galeria1 ? 'Cerrar Galería de Fotos' : 'Abrir Galería de Fotos'}
                        </button>
                        {galeria1 && <GaleriaFotos activo={modoActivo === 'galeria'} onPhotoSelected={handlePhotoData} onFotoElegida={(data) => handlePhotoData(data)}/>}
                    </div>
                   

                </div>
                <input type="number" placeholder="Valor del contador" ref={numeroBYN}/>
            </label>
            
            { tipoContador === 0 && (
                
            <label>
                Contador Color:
                <div>
                    <button onClick={() => [setShowCamera2(!showCamera2), setModoActivo('camara')]}>
                        {showCamera2 ? 'Cerrar Cámara' : 'Abrir Cámara'}
                    </button>
                    {showCamera2 && <Camara activo={modoActivo === 'camara'} onPhotoTaken={handlePhotoData2} />}
                </div>
                <div>
                    <button onClick={() => [setGaleria2(!galeria2), setModoActivo('galeria')]}>
                        {galeria2 ? 'Cerrar Galería de Fotos' : 'Abrir Galería de Fotos'}
                    </button>
                    {galeria2 && <GaleriaFotos activo={modoActivo === 'galeria'} onPhotoSelected={handlePhotoData2} />}
                </div>
                <input type="number" placeholder="Valor del contador" ref={numeroColor}/>
                
            </label>
            )}
            <input type="button" value="Enviar" className="btn-menu" onClick={enviarContador}/>
        </div>
    </div>
  )
}

export default EnviarContador