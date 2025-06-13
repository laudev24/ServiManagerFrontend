import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { guardarClientes } from '../features/clientesSlice'
import { useNavigate } from 'react-router-dom';

const NuevoCliente = () => {
    const categorias = useSelector(state => state.categoriasSlice.categorias);
    const [mensaje, setMensaje] = useState("")

    const campoNombreEmpresa = useRef("")
    const campoDireccion = useRef("")
    const campoEmail = useRef("")
    const campoCategoria = useRef("")
    const campoNombreContacto = useRef("")
    const campoTelefono = useRef("")
    const campoRut = useRef("")
    // const campoCargoFijo = useRef("")
    const campoFechaPago = useRef("")
    const campoNombreUsuario = useRef("")
    const campoContrasenia = useRef("")
    const campoContrasenia2 = useRef("")

    const dispatch = useDispatch();
    let navigate = useNavigate();

    
    const registrar = () => {
      const clienteNuevo = {
        nombre: campoNombreUsuario.current.value,
        contraseña: campoContrasenia.current.value,
        nombreEmpresa: campoNombreEmpresa.current.value,
        email: campoEmail.current.value,
        rut: campoRut.current.value,
        direccion: campoDireccion.current.value,
        telefono: campoTelefono.current.value,
        // categoria: campoCategoria.current.value,
        nombreContacto: campoNombreContacto.current.value
      };


      console.log("Datos a enviar:", clienteNuevo);

      //En el backend estaria faltando la categoria y la fecha de pago, que tiene tres opciones: del 1 al 10, del 11 al 20 y del 21 al 30. 
      
      if(campoContrasenia.current.value.toLowerCase() === campoContrasenia2.current.value.toLowerCase()){
        fetch("https://localhost:5201/api/cliente", {
          method: 'POST',
          body: JSON.stringify(clienteNuevo),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
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
          // .then((response) => response.json())
          // .then((datos) => {
          //   console.log(datos.codigo)
          //   if(datos.codigo===201){
          //     navigate("/clientes")
          //     console.log(datos.mensaje);
          //     toast("Cliente creado con éxito.")
          //     dispatch(guardarClientes(datos))
          //   }
          //   else {
          //     console.log(datos.message)
          //     toast("Error al registrar cliente.");
          //     setMensaje(datos.message)
          //     // toast("Hasta aca llegue")
          //   }
          // })
        .catch((error) => {
          console.error("Error al crear cliente:", error.message); 
          toast(error.message);
          setMensaje(error.message)
        });
      }
    }




  return (
    <div>
        <h1>Registro de nuevo cliente</h1>
        <label>Nombre de la empresa:
        <input type="text" className="nombreEmp" ref={campoNombreEmpresa}/>
        </label><br/>
        <select className="categoriaCliente" ref={campoCategoria}>
            <option value="">Elegir categoría</option>
            {categorias.map((cat) => (
                <option key={cat.id}>{cat.nombre}</option>
            ))}
            {categorias.length===0 && <option key="">No hay categorías para mostrar</option>}
        </select><br/>
        <label>Dirección:
        <input type="text" className="direccion" ref={campoDireccion}/>
        </label><br/>
        <label>Nombre del contacto:
        <input type="text" className="nombreContacto" ref={campoNombreContacto}/>
        </label><br/>
        <label>Teléfono/Celular de contacto:
        <input type="text" className="tel" ref={campoTelefono} />
        </label><br/>
        <label>Correo electrónico:
        <input type="email" className="email" ref={campoEmail}/>
        </label><br/>
        <label>RUT:
        <input type="text" className="rut" ref={campoRut}/>
        </label><br/>
        <label>Fecha de pago:
        <select className="selFechaPago" ref={campoFechaPago}>
            <option value="">Elegir rango</option>
            <option value="1 al 10">1 al 10</option>
            <option value="11 al 20">11 al 20</option>
            <option value="21 al 30">21 al 30</option>
        </select>
        </label><br/>
        <div id="crearUsuario">
            <label>Nombre de usuario:
            <input type="text" className="usu" ref={campoNombreUsuario}/>
            </label><br/>
            <label>Contraseña:
            <input type="password" className="contra" ref={campoContrasenia}/>
            </label><br/>
            <label>Repetir contraseña:
            <input type="password" className="contra2" ref={campoContrasenia2}/>
            </label><br/>
        </div>
        <p>{mensaje}</p>
        <input type="button" value="Registrar Cliente" onClick={registrar}/>
    </div>
  )
}

export default NuevoCliente