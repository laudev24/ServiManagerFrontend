import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { guardarClientes } from '../features/clientesSlice'
import { useNavigate } from 'react-router-dom';

const NuevoCliente = () => {
    const categorias = useSelector(state => state.categoriasSlice.categorias);
    const token = localStorage.getItem("token")
    
    const [mensaje, setMensaje] = useState("")

    const campoNombreEmpresa = useRef("")
    const campoDireccion = useRef("")
    const campoEmail = useRef("")
    const campoCategoria = useRef("")
    const campoNombreContacto = useRef("")
    const campoTelefono = useRef("")
    const campoRut = useRef("")
    const campoFechaPago = useRef("")
    const campoNombreUsuario = useRef("")
    const campoContrasenia = useRef("")
    const campoContrasenia2 = useRef("")

    const dispatch = useDispatch();
    let navigate = useNavigate();

    useEffect(() => {

       if(!localStorage.getItem("token"))
      navigate("/")
        if(localStorage.getItem("esAdmin") === "false")
      navigate("/inicio")
     
    }, [])
    
    const registrar = () => {
      // console.log("Categorias:", categorias);
      // const categoriaSeleccionada = categorias.find(cat => cat.id === Number(campoCategoria.current.value));
      // console.log("Categoría seleccionada:", categoriaSeleccionada);
      const clienteNuevo = {
        id : 0,
        nombre: campoNombreUsuario.current.value,
        contraseña: campoContrasenia.current.value,
        nombreEmpresa: campoNombreEmpresa.current.value,
        email: campoEmail.current.value,
        rut: campoRut.current.value,
        direccion: campoDireccion.current.value,
        telefono: campoTelefono.current.value,
        categoria: Number(campoCategoria.current.value),
        nombreContacto: campoNombreContacto.current.value,
        esAdministrador: false
      };


      console.log("Datos a enviar:", clienteNuevo); 

      //En el backend estaria faltando la fecha de pago, que tiene tres opciones: del 1 al 10, del 11 al 20 y del 21 al 30. 
      
      if(campoContrasenia.current.value.toLowerCase() === campoContrasenia2.current.value.toLowerCase()){
        fetch("https://localhost:5201/api/cliente", {
          method: 'POST',
          body: JSON.stringify(clienteNuevo),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`

          },
          })
          .then(async (response) => {
            const contentType = response.headers.get('content-type');
            
            let data;
            if (contentType && contentType.includes('application/json')) {
              data = await response.json();
            } else {
              const text = await response.text();
              throw new Error(text);
            }
            console.log(data.codigo)
            console.log(response.ok)
            if (response.ok && data.codigo === 201 || data.codigo === undefined) {
              toast("Cliente creado con éxito.");
              dispatch(guardarClientes(data));
              navigate("/clientes");
            } else {
              toast(data.message || "Error al registrar cliente.");
              setMensaje(data.message || "Error al registrar cliente.");
            }
          })
        .catch((error) => {
          console.error("Error al crear cliente:", error.message); 
          toast(error.message);
          setMensaje(error.message)
        });
      }
    }




  return (
    <div className="contenedor-menu">

<div className="formulario-cliente">
  <h1>Registro de nuevo cliente</h1>

  <label>
    Nombre de la empresa:
    <input type="text" ref={campoNombreEmpresa} />
  </label>

  <label>
    Categoría:
    <select ref={campoCategoria}>
      <option value="">Elegir categoría</option>
      {categorias.map((cat) => (
        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
      ))}
      {categorias.length === 0 && <option key="">No hay categorías para mostrar</option>}
    </select>
  </label>

  <label>
    Dirección:
    <input type="text" ref={campoDireccion} />
  </label>

  <label>
    Nombre del contacto:
    <input type="text" ref={campoNombreContacto} />
  </label>

  <label>
    Teléfono/Celular de contacto:
    <input type="text" ref={campoTelefono} />
  </label>

  <label>
    Correo electrónico:
    <input type="email" ref={campoEmail} />
  </label>

  <label>
    RUT:
    <input type="text" ref={campoRut} />
  </label>

  <label>
    Fecha de pago:
    <select ref={campoFechaPago}>
      <option value="">Elegir rango</option>
      <option value="1 al 10">1 al 10</option>
      <option value="11 al 20">11 al 20</option>
      <option value="21 al 30">21 al 30</option>
    </select>
  </label>

  <label>
    Nombre de usuario:
    <input type="text" ref={campoNombreUsuario} />
  </label>

  <label>
    Contraseña:
    <input type="password" ref={campoContrasenia} />
  </label>

  <label>
    Repetir contraseña:
    <input type="password" ref={campoContrasenia2} />
  </label>

  {mensaje && <p>{mensaje}</p>}

  <input type="button" value="Registrar Cliente" onClick={registrar} />
</div>
</div>

  )
}

export default NuevoCliente