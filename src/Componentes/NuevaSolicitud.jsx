import React, { use, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const NuevaSolicitud = () => {
    let navigate = useNavigate()
    const campoDescripcion = useRef("");
    const maquinasAsociadas = useSelector((state) => state.maquinas.maquinasAsociadas);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if(!localStorage.getItem("token"))
            navigate("/")
        if(localStorage.getItem("esAdmin") === "true")
            navigate("/InicioAdm")
    }, [])

    const enviarFormulario = () => {
        const descripcion = campoDescripcion.current.value;
        const maquinaSeleccionadaId = document.querySelector('select').value;
        if (!descripcion || !maquinaSeleccionadaId) {
            toast.error("Por favor, completa todos los campos.");
            return;
        }
        const solicitud = {
            descripcion: descripcion,
            maquinaId: maquinaSeleccionadaId
        };
        fetch("https://localhost:5001/api/solicitudes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(solicitud)
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
            navigate("/InicioCliente");
        })
        .catch(error => {
            console.error("Error:", error);
            toast.error("Ocurrió un error al enviar la solicitud.");
        });
    }


  return (
    <div className="contenedor-menu">
        <div className="formulario-cliente">
            <h1>Crear una Solicitud de Servicio Técnico</h1>
            <label>Elegir la máquina:
              <select>
                  {maquinasAsociadas.map((maq) => (
                    <option key={maq.id} value={maq.id}>
                        {maq.numero} -  {maq.marca} - {maq.modelo}
                    </option>
                  ))}
                </select>
            </label>    
            <label>
                Descripción:
                <textarea ref={campoDescripcion} />
            </label>
            <button className="btn-menu" onClick={() => {enviarFormulario}}>Enviar Solicitud</button>
        </div>
    </div>
  )
}

export default NuevaSolicitud