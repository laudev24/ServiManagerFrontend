import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { guardarClientes } from '../features/clientesSlice'
import { useNavigate } from 'react-router-dom';

const NuevoCliente = () => {
  const categorias = useSelector(state => state.categoriasSlice.categorias);
  const token = localStorage.getItem("token")
  const API_URL = import.meta.env.VITE_API_URL
  const [mensaje, setMensaje] = useState("")

  const campoNombreEmpresa = useRef("")
  const campoDireccion = useRef("")
  const campoEmail = useRef("")
  const campoCategoria = useRef("")
  const campoNombreContacto = useRef("")
  const campoTelefono = useRef("")
  const campoRut = useRef("")
  const campoNombreUsuario = useRef("")
  const campoContrasenia = useRef("")
  const campoContrasenia2 = useRef("")
  const campoFechaPago = useRef("") 

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const registrar = () => {
    const clienteNuevo = {
      id: 0,
      nombre: campoNombreUsuario.current.value,
      contraseña: campoContrasenia.current.value,
      nombreEmpresa: campoNombreEmpresa.current.value,
      email: campoEmail.current.value,
      rut: campoRut.current.value,
      direccion: campoDireccion.current.value,
      telefono: campoTelefono.current.value,
      categoria: Number(campoCategoria.current.value),
      nombreContacto: campoNombreContacto.current.value,
      fechaPago: campoFechaPago.current.value !== "" ? Number(campoFechaPago.current.value) : null,
      esAdministrador: false
    };

    if (campoContrasenia.current.value === campoContrasenia2.current.value) {
      fetch(`${API_URL}/cliente`, {
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
          if ((response.ok && data.codigo === 201) || data.codigo === undefined) {
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
            {categorias.length === 0 && <option>No hay categorías para mostrar</option>}
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

        <label>
          Fecha de pago:
          <select ref={campoFechaPago}>
            <option value="">Seleccionar rango de pago</option>
            <option value="0">Del 1 al 10</option>
            <option value="1">Del 11 al 20</option>
            <option value="2">Del 21 al 30</option>
          </select>
        </label>

        {mensaje && <p>{mensaje}</p>}

        <input type="button" value="Registrar Cliente" onClick={registrar} />
      </div>
    </div>
  )
}

export default NuevoCliente
