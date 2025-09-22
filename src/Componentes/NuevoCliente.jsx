import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { guardarClientes } from '../features/clientesSlice'
import { useNavigate } from 'react-router-dom';

const NuevoCliente = () => {
    const cat =  useSelector(state => state.categoriasSlice.categorias);
  const token = localStorage.getItem("token")
  const API_URL = import.meta.env.VITE_API_URL
  const [mensaje, setMensaje] = useState("")
  const [nivelSeguridad, setNivelSeguridad] = useState("");
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [categorias, setCategorias] = useState([])
  const [mostrarInfoContrasenia, setMostrarInfoContrasenia] = useState(false);



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

  const traerCategorias = async () => {
    try {
      const resp = await fetch(`${API_URL}/categoria`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!resp.ok) {
        throw new Error("Error al traer las categorías");
      }
      const datos = await resp.json();
      setCategorias(datos);
    } catch (error) {
      console.error("Error en traerCategorias:", error);
      // toast.error("No se pudieron cargar las categorías");
    }
  };


 useEffect(() => {
    if (cat &&  cat.length > 0) {
      setCategorias(cat);
    } else {
      traerCategorias();
    }
  }, [cat, API_URL, token]); 
  


  const validarContrasenia = (password, campos) => {
    const errores = [];

    // Longitud
    if (password.length < 12 || password.length > 20) {
      errores.push("Debe tener entre 12 y 20 caracteres.");
    }

    // Letras, números y símbolos
    if (!/[A-Z]/.test(password)) errores.push("Debe contener al menos una letra mayúscula.");
    if (!/[a-z]/.test(password)) errores.push("Debe contener al menos una letra minúscula.");
    if (!/[0-9]/.test(password)) errores.push("Debe contener al menos un número.");
    if (!/[?!@#$%.\-;,&_]/.test(password)) errores.push("Debe contener al menos un carácter especial permitido.");

    // Datos personales
    const lowerPassword = password.toLowerCase();
    campos.forEach((campo) => {
      if (campo && lowerPassword.includes(campo.toLowerCase())) {
        errores.push("La contraseña no puede contener datos personales.");
      }
    });

    return errores;
  };

  const obtenerNivelSeguridad = (password) => {
    let puntaje = 0;

    if (password.length >= 12) puntaje++;
    if (/[A-Z]/.test(password)) puntaje++;
    if (/[a-z]/.test(password)) puntaje++;
    if (/[0-9]/.test(password)) puntaje++;
    if (/[?!@#$%.\-;,&_]/.test(password)) puntaje++;

    if (puntaje <= 2) return "Baja";
    if (puntaje === 3 || puntaje === 4) return "Media";
    return "Alta";
  };







  const registrar = () => {
   

    const contrasenia = campoContrasenia.current.value;
const contrasenia2 = campoContrasenia2.current.value;

if (contrasenia !== contrasenia2) {
  toast("Las contraseñas no coinciden.");
  return;
}

const errores = validarContrasenia(contrasenia, [
  campoNombreUsuario.current.value,
  campoEmail.current.value,
  campoTelefono.current.value,
  campoRut.current.value,
  campoDireccion.current.value,
  campoNombreEmpresa.current.value,
  campoNombreContacto.current.value
]);

if (errores.length > 0) {
  setMensaje(errores.join(" "));
  toast.error("Error en la contraseña: " + errores.join(" "));
  return;
}
 const clienteNuevo = {
      id: 0,
      nombre: campoNombreUsuario.current.value,
      contraseña: campoContrasenia.current.value,
      nombreEmpresa: campoNombreEmpresa.current.value,
      email: campoEmail.current.value,
      rut: campoRut.current.value,
      direccion: campoDireccion.current.value,
      telefono: campoTelefono.current.value,
      categoria: campoCategoria.current.value,
      nombreContacto: campoNombreContacto.current.value,
      fechaPago: campoFechaPago.current.value !== "" ? campoFechaPago.current.value : null,
      esAdministrador: false
    };

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

  if(categorias === null) return <p>Cargando datos...</p>

  return (
    <div className="contenedor-menu">
      <div className="contenedor-secundario">
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
          <span
    style={{
      marginLeft: "6px",
      cursor: "pointer",
      fontSize: "14px",
      color: "#007bff"
    }}
    title="Mostrar reglas"
    onClick={() => setMostrarInfoContrasenia(!mostrarInfoContrasenia)}
  >
    ℹ️
  </span>

  {mostrarInfoContrasenia && (
    <div style={{
      backgroundColor: "#f0f0f0",
      border: "1px solid #ccc",
      padding: "8px",
      marginTop: "4px",
      fontSize: "14px",
      borderRadius: "4px",
      width: "100%"
    }}>
      <strong>Requisitos de la contraseña:</strong>
      <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
        <li>12 a 20 caracteres</li>
        <li>Al menos una letra mayúscula</li>
        <li>Al menos una letra minúscula</li>
        <li>Al menos un número</li>
        <li>Al menos un símbolo: ? ! @ # $ % . - ; , &</li>
        <li>No debe contener datos personales</li>
      </ul>
    </div>
  )}
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={mostrarContrasenia ? "text" : "password"}
              ref={campoContrasenia}
              onChange={(e) => {
                const valor = e.target.value;
                const nivel = obtenerNivelSeguridad(valor);
                setNivelSeguridad(nivel);
              }}
              style={{ flex: 1 }}
            />
            <button
              type="button"

              onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
              style={{
                marginLeft: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                width: "10px"
              }}
              title={mostrarContrasenia ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {mostrarContrasenia ? "🙈" : "👁️"}
            </button>
          </div>

          {/* <input
            type="password"
            ref={campoContrasenia}
            onChange={() => {
              const valor = campoContrasenia.current.value;
              const nivel = obtenerNivelSeguridad(valor);
              setNivelSeguridad(nivel);
            }}
          /> */}
          {nivelSeguridad && (
            <p style={{
              color: nivelSeguridad === "Alta" ? "green" :
                    nivelSeguridad === "Media" ? "orange" :
                    "red"
            }}>
              Seguridad de la contraseña: {nivelSeguridad}
            </p>
          )}
        </label>

        <label>
          Repetir contraseña:
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={mostrarContrasenia ? "text" : "password"}
              ref={campoContrasenia2}
              // onChange={() => {
                // const valor = campoContrasenia.current.value;
                // const nivel = obtenerNivelSeguridad(valor);
                // setNivelSeguridad(nivel);
              // }}
              style={{ flex: 1 }}
            />
            <button
              type="button"

              onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
              style={{
                marginLeft: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                width: "10px"
              }}
              title={mostrarContrasenia ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {mostrarContrasenia ? "🙈" : "👁️"}
            </button>
          </div>
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
