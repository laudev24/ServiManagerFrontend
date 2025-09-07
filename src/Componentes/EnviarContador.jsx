import React, { useCallback, useEffect, useRef, useState } from 'react'
import Camara from './Camara'
import GaleriaFotos from './GaleriaFotos'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const EnviarContador = () => {

    let navigate = useNavigate();

    const [showCamera1, setShowCamera1] = React.useState(false);
    const [galeria1, setGaleria1] = useState(false);
    const [foto, setFoto] = useState(null);
    const [fotoFile, setFotoFile] = useState(null);
    const [fotoUrl, setFotoUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [modoActivo, setModoActivo] = useState(null); // 'camara' o 'galeria'
    const [maquinasAsociadas, setMaquinasAsociadas] = useState([]);
    const [tipoContador, setTipoContador] = useState(1);
    const [maquinaIdSel, setMaquinaIdSel] = useState(1);

    const numeroBYN = useRef(null)
    const numeroColor = useRef(null)
    const clienteId = localStorage.getItem("clienteId")
    const token = localStorage.getItem("token");
    const API_URL=import.meta.env.VITE_API_URL

    useEffect(() => {
  
     setModoActivo(''); 
        if(clienteId === -1)traerClienteId();
        else traerMaquinasDelCliente();

    }, [])

    const traerMaquinasDelCliente = () => {
        if (clienteId !== -1) {
            fetch(`${API_URL}/cliente/maquinas-del-cliente?id=${clienteId}`, {
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
    }

    const traerClienteId = () => {
        const nombre = localStorage.getItem("nombre");
        fetch(`${API_URL}/cliente/usuario?nombre=${nombre}`, {
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
            localStorage.setItem("clienteId", datos.id);
            traerMaquinasDelCliente()
        })
        .catch(error => {
            console.error("Error al obtener el cliente:", error);
        })
    }

    const setContador = () => {
        const maquinaIdSel = Number(document.querySelector('select').value); // Obtengo el ID
        const maquina = maquinasAsociadas.find(maq => maq.id === Number(maquinaIdSel));
        if (maquina.tipoImpresion === "Color") {
            setTipoContador(0); // Tipo de contador: 0 para color
        } else {    
            setTipoContador(1); // Tipo de contador: 1 para B&N
        }
    }
        
    

    // const handlePhotoData = (photoData) => {
    //     console.log("Foto a enviar b/n :", photoData);
    //     setFoto(photoData) 
    //     return( <img src={foto} alt="Foto a enviar" /> )
    // };
    const handlePhotoData = useCallback((file) => {
        setFotoFile(file);
        const url = URL.createObjectURL(file);
        setFotoUrl(prev => { 
            prev && URL.revokeObjectURL(prev); 
            return url });
    }, []);

   



    const enviarContador = useCallback(async () => {
        if(numeroBYN.current.value.trim() != '' && Number(numeroBYN.current.value) < 0){
            toast.error("El valor del contador B/N no puede ser negativo");
            return;
        }
        else if(numeroBYN.current.value.trim() === ''){
            toast.error("Debe ingresar un valor numérico para el contador B/N");
            return;
        }
        const valorBYN = numeroBYN.current.value;
        const maquinaId = Number(document.querySelector('select').value); // Obtengo el ID de la máquina seleccionada
        const maquina = maquinasAsociadas.find(maq => maq.id === maquinaId);
        const contadorByn = {  
            "id": 0,
            "clienteId": Number(clienteId),
            "maquinaId": Number(maquinaId),
            "fechaYHora": null,
            "confirmado": true,
            "contador": 0,
            "tipoImpresion": "Monocromatico",
            "mensaje": valorBYN
        }
      
        if(fotoFile) setSubmitting(true);
        const formData = new FormData();

        formData.append("EnviosContadores[0].EnvioContador", new Blob([JSON.stringify(contadorByn)], { type: "application/json" }));
        formData.append("EnviosContadores[0].Imagen", fotoFile || null);
        
       if(maquina.tipoImpresion === "Color"){
         if(numeroColor.current.value.trim() != '' && Number(numeroColor.current.value) < 0){
            toast.error("El valor del contador Color no puede ser negativo");
            return;
        }
        else if(numeroColor.current.value.trim() === ''){
            toast.error("Debe ingresar un valor numérico para el contador Color");
            return;
        }
            const valorColor = numeroColor.current.value;
            const contadorColor = {  
                "id": 0,
                "clienteId": Number(clienteId),
                "maquinaId": Number(maquinaId),
                "fechaYHora": null,
                "confirmado": true,
                "contador": 0,
                "tipoImpresion": "Color",
                "mensaje": valorColor
            }
            formData.append("EnviosContadores[1].EnvioContador", new Blob([JSON.stringify(contadorColor)], { type: "application/json" }));
            formData.append("EnviosContadores[1].Imagen", fotoFile || null);
        
            // console.log("Datos a enviar:", formData);

            // for (let pair of formData.entries()) {
            //     console.log(`${pair[0]}:`, pair[1]);
            // }
            fetch(`${API_URL}/envioContador`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(r => {
                if(!r.ok){
                    // console.error("Error en la respuesta del servidor:", r.statusText);
                    // toast.error("Error en la respuesta del servidor");
                    throw new Error("Error en la respuesta del servidor", r);
                }
                else if(r.ok)
                    navigate("/contadoresEnviados")
                    toast.success("Contador enviado con éxito");
                return r.json();
            })
            .catch(error => {
                console.error("Error al enviar el contador:", error);
                toast.error("Error al enviar el contador");
            })
            .finally(setSubmitting(false));
        }
        else if(maquina.tipoImpresion === "Monocromatico"){
            // console.log("Datos a enviar:", formData)
            // for (let pair of formData.entries()) {
            //     console.log(`${pair[0]}:`, pair[1]);
            // }
            fetch(`${API_URL}/envioContador`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(r => {
                if(!r.ok){
                    // console.error("Error en la respuesta del servidor:", r.statusText);
                    // toast.error("Error en la respuesta del servidor");
                    throw new Error("Error en la respuesta del servidor", r);
                }
                else if(r.ok){
                    navigate("/contadoresEnviados")
                    toast.success("Contador enviado con éxito");
                }
                return r.json();
            })
            .catch(error => {
                console.error(error);
                toast.error("Error al enviar el contador");
            })
            .finally(setSubmitting(false));
        }
        

    }, [fotoFile, numeroBYN, numeroColor, maquinaIdSel])

    
  return (
    <div className="contenedor-menu">
        <div className="contenedor-secundario">
            <h1>Enviar Contador</h1>
            <label>
                Selecciona la máquina:
                <select value={maquinaIdSel} onChange={e => [setMaquinaIdSel(+e.target.value), setContador()]}>
                {/* <select onChange={setContador} defaultValue=""> */}
                    {maquinasAsociadas.map((maq) => (
                    <option key={maq.id} value={maq.id}>
                        {maq.numero} - {maq.marca} - {maq.modelo}
                    </option>
                    ))}
                </select>
            </label>
            <div>
                <div>
                    <button onClick={() => [setShowCamera1(!showCamera1), setModoActivo('camara')]}>
                        {showCamera1 ? 'Cerrar Cámara' : 'Abrir Cámara'}
                    </button>
                    {showCamera1 && <Camara activo={modoActivo === 'camara'} /*onPhotoTaken={handlePhotoData}*/ onData={(data) => handlePhotoData(data)} />}
                </div>
                <div>
                    <button className="btn-contrasenia" onClick={() => [setGaleria1(!galeria1), setModoActivo('galeria')]}>
                        {galeria1 ? 'Cerrar Galería de Fotos' : 'Abrir Galería de Fotos'}
                    </button>
                    {galeria1 && <GaleriaFotos activo={modoActivo === 'galeria'} onPhotoSelected={handlePhotoData} onData={(data) => handlePhotoData(data)}/>}
                </div>
            </div>
            <label className='label-contador'>
                Contador B/N:
                <input type="number" placeholder="Valor del contador" ref={numeroBYN}/>
            </label>
            
            { tipoContador === 0 && (
                
            <label>
                Contador Color:
                <input type="number" placeholder="Valor del contador" ref={numeroColor}/>
            </label>
            )}
            <button disabled={submitting} onClick={enviarContador}>Enviar</button>
            {submitting && <p>Enviando...</p>}
        </div>
    </div>
  )
}

export default EnviarContador