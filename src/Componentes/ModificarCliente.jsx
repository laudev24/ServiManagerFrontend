import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { guardarClientes } from '../features/clientesSlice';
import { guardarCategorias } from '../features/categoriasSlice';

const ModificarCliente = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  // const token = useSelector(state => state.usuarioSlice.token)
    const token = localStorage.getItem("token")
  

  const categorias = useSelector(state => state.categoriasSlice.categorias);
  // const clientes = useSelector(state => state.clientesSlice.clientes);
  // const cliente = clientes.find(c => c.id === Number(id))
  const [cliente, setCliente] = useState("")
  const [nombreEmpresa, setNombreEmpresa] = useState("")
  const [direccion, setDireccion] = useState("")
  const [email, setEmail] = useState("")
  const [categoria, setCategoria] = useState("")
  const [nombreContacto, setNombreContacto] = useState("")
  const [telefono, setTelefono] = useState("")
  const [rut, setRut] = useState("")
  const [fechaPago, setFechaPago] = useState("")
  const [nombre, setNombre] = useState("")

  useEffect(() => {
    // if(token==="")setToken(localStorage.getItem("token"))
    //   else setToken(tokenSelector)
    if(categorias.length===0)cargarCategorias()
    if(cliente==="")traerCliente()
  }, [])

  const cargarCategorias = () => {
    fetch("https://localhost:5201/api/categoria", {
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
      //  setCategorias(datos)
        dispatch(guardarCategorias(datos))
    })
  }

  const traerCliente = () => {
      fetch(`https://localhost:5201/api/cliente/${id}`, {
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
      setCliente(datos)
   
    })
    .catch(error => {
      console.error("Error al obtener el cliente:", error);
    })
 
  }

  useEffect(() => {
    if (cliente && categorias.length > 0) {
      setNombreEmpresa(cliente.nombreEmpresa)
      setDireccion(cliente.direccion)
      setEmail(cliente.email)
      const cat = categorias.find(c => c.id === cliente.categoria)
      setCategoria(cat)
      setNombreContacto(cliente.nombreContacto)
      setTelefono(cliente.telefono)
      setRut(cliente.rut)
      setFechaPago(cliente.fechaPago)
      setNombre(cliente.nombre)
    }
  }, [cliente, categorias])
  
  

  const modificar = () => {
    // console.log(categoria)
    const clienteModificado = {
      id: Number(id),
      nombre: nombre,
      contraseña: cliente.contraseña,
      nombreEmpresa: nombreEmpresa,
      email: email,
      rut: rut,
      direccion: direccion,
      telefono: telefono,
      nombreContacto: nombreContacto,
      activo: cliente.activo,
      categoria: Number(categoria)
    };

  // console.log("Datos a enviar:", clienteModificado);
  // console.log("Cliente original:", cliente);

  fetch(`https://localhost:5201/api/cliente/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clienteModificado),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${token}`

    },
    })
    .then((response) => {
      response.json()
      console.log(response)
      if(response.status===200){
          toast("Cliente modificado con éxito")
          navigate('/clientes')
      }
    })
    .catch((error) => {
      console.error("Error al modificar cliente:", error.message); // usa correctamente "error"
      toast("Error al modificar cliente.");
    });
  }
  if (!cliente) {
    return <p>Cargando cliente...</p>;
  }

  return (
    <div className="contenedor-menu">

<div className="formulario-cliente">
  <h1>Modificar cliente</h1>

  <label>
    Nombre de la empresa:
    <input
      type="text"
      onChange={(e) => setNombreEmpresa(e.target.value)}
      value={nombreEmpresa || ''}
    />
  </label>

  <label>
    Categoría:
    <select
      onChange={(e) => setCategoria(e.target.value)}
      value={categoria || ''}
    >
      <option value={categoria?.id || ''}>{categoria?.nombre}</option>
      {categorias.map((cat) => (
        <option key={cat?.id} value={cat?.id}>{cat?.nombre}</option>
      ))}
      {categorias.length === 0 && <option>No hay categorías para mostrar</option>}
    </select>
  </label>

  <label>
    Dirección:
    <input
      type="text"
      onChange={(e) => setDireccion(e.target.value)}
      value={direccion || ''}
    />
  </label>

  <label>
    Nombre del contacto:
    <input
      type="text"
      onChange={(e) => setNombreContacto(e.target.value)}
      value={nombreContacto || ''}
    />
  </label>

  <label>
    Teléfono/Celular de contacto:
    <input
      type="text"
      onChange={(e) => setTelefono(e.target.value)}
      value={telefono || ''}
    />
  </label>

  <label>
    Correo electrónico:
    <input
      type="email"
      onChange={(e) => setEmail(e.target.value)}
      value={email || ''}
    />
  </label>

  <label>
    RUT:
    <input
      type="text"
      onChange={(e) => setRut(e.target.value)}
      value={rut || ''}
    />
  </label>

  <label>
    Fecha de pago:
    <select
      onChange={(e) => setFechaPago(e.target.value)}
      value={fechaPago || ''}
    >
      <option value="">Elegir rango</option>
      <option value="1 al 10">1 al 10</option>
      <option value="11 al 20">11 al 20</option>
      <option value="21 al 30">21 al 30</option>
    </select>
  </label>

  <label>
    Nombre de usuario:
    <input
      type="text"
      onChange={(e) => setNombre(e.target.value)}
      value={nombre || ''}
    />
  </label>

  <Link to="/#">Cambiar contraseña</Link>

  <input type="button" value="Modificar Cliente" onClick={modificar} />
</div>
</div>



    // <div>
    //    <h1>Modificar cliente</h1>
    //     <label>Nombre de la empresa:
    //       <input type="text" className="nombreEmp" onChange={(e) =>setNombreEmpresa(e.target.value)} value={nombreEmpresa || ''}/>
    //     </label><br/>
    //     <select className="categoriaCliente" onChange={(e) =>setCategoria(e.target.value)} value={categoria || ''}>
    //         <option value={categoria?.id || ''}>{categoria?.nombre}</option>
    //         {categorias.map((cat) => (
    //             <option key={cat?.id} value={cat?.id}>{cat?.nombre}</option>
    //         ))}
    //         {categorias.length===0 && <option key="">No hay categorías para mostrar</option>}
    //     </select><br/>
    //     <label>Dirección:
    //       <input type="text" className="direccion" onChange={(e) =>setDireccion(e.target.value)} value={direccion || ''}/>
    //     </label><br/>
    //     <label>Nombre del contacto:
    //       <input type="text" className="nombreContacto" onChange={(e) =>setNombreContacto(e.target.value)} value={nombreContacto || ''}/>
    //     </label><br/>
    //     <label>Teléfono/Celular de contacto:
    //       <input type="text" className="tel" onChange={(e) =>setTelefono(e.target.value)} value={telefono || ''}/>
    //     </label><br/>
    //     <label>Correo electrónico:
    //       <input type="email" className="email" onChange={(e) =>setEmail(e.target.value)} value={email || ''}/>
    //     </label><br/>
    //     <label>RUT:
    //       <input type="text" className="rut" onChange={(e) =>setRut(e.target.value)} value={rut || ''}/>
    //     </label><br/>
    //     <label>Fecha de pago:
    //       <select className="selFechaPago" onChange={(e) =>setFechaPago(e.target.value)} value={fechaPago || ''}>
    //           <option value="">Elegir rango</option>
    //           <option value="1 al 10">1 al 10</option>
    //           <option value="11 al 20">11 al 20</option>
    //           <option value="21 al 30">21 al 30</option>
    //       </select>
    //     </label><br/>
    //     <label>Nombre de usuario:
    //       <input type="text" className="usu" onChange={(e) =>setNombre(e.target.value)} value={nombre || ''}/>
    //     </label><br/>
    //     <Link to="/#">Cambiar contraseña</Link>
    //     <input type="button" value="Modificar Cliente" onClick={modificar}/>
    //   </div>
  )
}

export default ModificarCliente