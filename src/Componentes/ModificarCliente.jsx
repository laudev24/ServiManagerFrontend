import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { guardarClientes } from '../features/clientesSlice';
import { modificarCliente } from '../features/clientesSlice';
import { guardarCategorias } from '../features/categoriasSlice';

const ModificarCliente = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token")
  const API_URL=import.meta.env.VITE_API_URL

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

    if (categorias.length === 0) cargarCategorias()
    if (cliente === "") traerCliente()
  }, [])

  const cargarCategorias = () => {
    fetch(`${API_URL}/categoria`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => {
        if (!r.ok) {
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
    fetch(`${API_URL}/cliente/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => {
        if (!r.ok) {
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
      const categoriaEncontrada = categorias.find(c => c.id === cliente.categoria);
      setCategoria(categoriaEncontrada ? categoriaEncontrada.nombre : "");
      setNombreContacto(cliente.nombreContacto)
      setTelefono(cliente.telefono)
      setRut(cliente.rut)
      setFechaPago(cliente.fechaPago)
      setNombre(cliente.nombre)
    }
  }, [cliente, categorias])



  const modificar = () => {
    const categoriaSeleccionada = categorias.find(c => c.nombre === categoria);

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
      categoria: categoriaSeleccionada ? categoriaSeleccionada.id : null,
      fechaPago: fechaPago
    };

    fetch(`${API_URL}/cliente/${cliente.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(clienteModificado)
    })
      .then(async r => {
        if (!r.ok) {
          const errorText = await r.text();
          throw new Error(errorText);
        }
        return r.json();
      })
      .then(data => {
        dispatch(modificarCliente(data));
        toast.success("Cliente modificado con éxito");
        navigate("/clientes");
      })
      .catch(err => {
        console.error(err);
        toast.error(err.message);
      });

  };

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
            value={categoria}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
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
  )
}

export default ModificarCliente