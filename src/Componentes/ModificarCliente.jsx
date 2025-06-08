import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'


const ModificarCliente = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  const categorias = useSelector(state => state.categoriasSlice.categorias);
  const clientes = useSelector(state => state.clientesSlice.clientes);
  const cliente = clientes.find(c => c.id === Number(id))
 
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

  const modificar = () => {
    const clienteModificado = {
      activo: cliente.activo,
      contraseña: cliente.contraseña,
      direccion: campoDireccion.current.value,
      email: campoEmail.current.value,
      id: Number(id),
      nombre: campoNombreUsuario.current.value,
      nombreContacto: campoNombreContacto.current.value,
      nombreEmpresa: campoNombreEmpresa.current.value,
      rut: campoRut.current.value,
      telefono: campoTelefono.current.value,
      // categoria: campoCategoria.current.value,
    };

  console.log("Datos a enviar:", clienteModificado);
  console.log("Cliente original:", cliente);

  fetch(`https://localhost:5201/api/cliente/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clienteModificado),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    })
    .then((response) => response.json())
    .then((datos) => {
      console.log(datos.codigo)
      // if(datos.codigo===200){
      if(datos.codigo===undefined || datos.codigo===200){ // el codigo que llega es undefined
        dispatch(guardarClientes(datos))
        navigate("/clientes")
        console.log(datos.codigo);
        toast("Cliente modificado con éxito.")
      }
      else {
        console.log(datos.codigo)
        toast(datos.mensaje);
        // toast("Hasta aca llegue")
      }
    })
    .catch((error) => {
      console.error("Error al modificar cliente:", error.message); // usa correctamente "error"
      toast("Error al modificar cliente.");
    });
  }

  return (
    <div>
       <h1>Modificar cliente</h1>
        <label>Nombre de la empresa:
        <input type="text" className="nombreEmp" ref={campoNombreEmpresa} defaultValue={cliente?.nombreEmpresa || ''}/>
        </label><br/>
        <select className="categoriaCliente" ref={campoCategoria} defaultValue={cliente?.categoria || ''}>
            {categorias.map((cat) => (
                <option key={cat.id}>{cat.nombre}</option>
            ))}
            {categorias.length===0 && <option key="">No hay categorías para mostrar</option>}
        </select><br/>
        <label>Dirección:
        <input type="text" className="direccion" ref={campoDireccion} defaultValue={cliente?.direccion || ''}/>
        </label><br/>
        <label>Nombre del contacto:
        <input type="text" className="nombreContacto" ref={campoNombreContacto} defaultValue={cliente?.nombreContacto || ''}/>
        </label><br/>
        <label>Teléfono/Celular de contacto:
        <input type="text" className="tel" ref={campoTelefono} defaultValue={cliente?.telefono || ''}/>
        </label><br/>
        <label>Correo electrónico:
        <input type="email" className="email" ref={campoEmail} defaultValue={cliente?.email || ''}/>
        </label><br/>
        <label>RUT:
        <input type="text" className="rut" ref={campoRut} defaultValue={cliente?.rut || ''}/>
        </label><br/>
        {/* <label>Cargo fijo:
        <input type="text" className="numCargo" ref={campoCargoFijo} defaultValue={cliente?.cargoFijo || ''}/>
        </label><br/> */}
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
            <input type="text" className="usu" ref={campoNombreUsuario} defaultValue={cliente?.nombre || ''}/>
            </label><br/>
            <Link to="/#">Cambiar contraseña</Link>
        </div>
        <input type="button" value="Modificar Cliente" onClick={modificar}/>
      </div>
  )
}

export default ModificarCliente