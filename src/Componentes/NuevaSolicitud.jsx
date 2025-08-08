import React, { use, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Camara from './Camara';
import GaleriaFotos from './GaleriaFotos';


const NuevaSolicitud = () => {
    let navigate = useNavigate()
    const campoDescripcion = useRef("");
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("clienteId");
    const [idCliente, setIdCliente] = useState(id);
    const [maquinasAsociadas, setMaquinasAsociadas] = useState([]);
    const [showCamera1, setShowCamera1] = React.useState(false);
        const [galeria1, setGaleria1] = useState(false);
        const [foto, setFoto] = useState(null);
        const [fotoFile, setFotoFile] = useState(null);
        const [fotoUrl, setFotoUrl] = useState("");
        const [submitting, setSubmitting] = useState(false);
        const [modoActivo, setModoActivo] = useState(null); // 'camara' o 'galeria'
    
    useEffect(() => {
        if(!id)traerCliente()
        else traerMaquinasAsociadas(id);
    }, [])

    const traerCliente = () => {
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
        localStorage.setItem("clienteId", datos.id);
        setIdCliente(datos.id);
        if(datos)traerMaquinasAsociadas(datos.id)
        })
        .catch(error => {
        console.error("Error al obtener el cliente:", error);
        })
        
    }

    const traerMaquinasAsociadas = () => {
        fetch(`https://localhost:5201/api/cliente/maquinas-del-cliente?id=${id}`, {
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

      const handlePhotoData = useCallback((file) => {
            setFotoFile(file);
            const url = URL.createObjectURL(file);
            setFotoUrl(prev => { 
                prev && URL.revokeObjectURL(prev); 
                return url });
        }, []);


    const enviarFormulario = () => {
        const descripcion = campoDescripcion.current.value;
        const maquinaSeleccionadaId = document.querySelector('select').value;
        if (!descripcion || descripcion.trim() === "") {
            toast.error("Por favor, ingresa una descripción."); }
        if (!maquinaSeleccionadaId){
            toast.error("Por favor, selecciona una máquina.");
            return;
        }
        const solicitud = {
            descripcion: descripcion,
            maquinaId: maquinaSeleccionadaId,
            clienteId: Number(id)
        };
        const formData = new FormData();

        formData.append(
          "SolicitudJson",
          JSON.stringify(solicitud));

        if (fotoFile) {
          formData.append("Imagen", fotoFile);
        }

        console.log("Solicitud a enviar:", solicitud);
        fetch("https://localhost:5201/api/solicitudServicio", {
            method: "POST",
            body: formData,
            headers: {
               'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("No autorizado. Por favor, inicia sesión.");
                    navigate("/");
                }else {
                    throw new Error("Error al enviar la solicitud");
                }
                throw new Error("Error al enviar la solicitud");
            }
            return response.json();
        })
        .then(data => {
            toast.success("Solicitud enviada con éxito.");
            campoDescripcion.current.value = "";
            navigate("/inicio")
            // navigate("/mis-solicitudes");
        })
        .catch(error => {
            console.error("Error:", error);
            toast.error("Ocurrió un error al enviar la solicitud.");
        });
    }


  return (
    <div className="contenedor-menu">
  <div className="formulario-cliente">
    <div className='servicioTecnico'>
    <h1>Solicitar Servicio Técnico</h1>

    <label htmlFor="maquina">Elegir la máquina:</label>
  <select id="maquina" className="form-control">
    {maquinasAsociadas.map((maq) => (
      <option key={maq.id} value={maq.id}>
        {maq.numero} - {maq.marca} - {maq.modelo}
      </option>
    ))}
  </select>

  <label htmlFor="descripcion">Descripción:</label>
  <textarea id="descripcion" className="form-control" ref={campoDescripcion} />

    <div className="opciones-foto">
      <div>
        <button onClick={() => [setShowCamera1(!showCamera1), setModoActivo('camara')]}>
          {showCamera1 ? 'Cerrar Cámara' : 'Abrir Cámara'}
        </button>
        {showCamera1 && <Camara activo={modoActivo === 'camara'} onData={handlePhotoData} />}
      </div>

      <div>
        <button onClick={() => [setGaleria1(!galeria1), setModoActivo('galeria')]}>
          {galeria1 ? 'Cerrar Galería de Fotos' : 'Abrir Galería de Fotos'}
        </button>
        {galeria1 && (
          <GaleriaFotos
            activo={modoActivo === 'galeria'}
            onPhotoSelected={handlePhotoData}
            onData={handlePhotoData}
          />
        )}
      </div>
    </div>

    <button className="btn-menu" onClick={enviarFormulario}>
      Enviar Solicitud
    </button>
    </div>
  </div>
</div>

  )
}

export default NuevaSolicitud