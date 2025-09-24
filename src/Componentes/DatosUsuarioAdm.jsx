import { set } from 'date-fns';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DatosUsuarioAdm = () => {
  const nombreUsuario = localStorage.getItem("nombre") 
  const id = Number(localStorage.getItem("idUsuario"))
  const token = localStorage.getItem("token")

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  // const [nombreUsuario, setNombreUsuario] = useState("");
  const [nivelSeguridad, setNivelSeguridad] = useState("");
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [mostrarContrasenia2, setMostrarContrasenia2] = useState(false);
  const [mostrarContrasenia3, setMostrarContrasenia3] = useState(false);

  const [mostrarInfoContrasenia, setMostrarInfoContrasenia] = useState(false);
   const [botonHabilitado, setBotonHabilitado] = useState(false);
   const [usuario, setUsuario] = useState(null)
   const contraseniaActual = useRef("")
  const errores = []
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const traerUsuario = () => {
    
    if(localStorage.getItem("esAdmin") == "false"){
    
    fetch(`${API_URL}/cliente/${id}`, {
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
      setUsuario(datos)
      localStorage.setItem("clienteId", datos.id);
    })
    .catch(error => {
      console.error("Error al obtener el cliente:", error);
    })
  }
}
useEffect(() => {
    traerUsuario()
}, [])

  useEffect(() => {
        if (
      contraseniaActual.current.value != "" &&
      nuevaPassword &&
      confirmarPassword &&
      nuevaPassword === confirmarPassword &&
      errores.length === 0
    ) {
      setBotonHabilitado(true);
    } else {
      setBotonHabilitado(false);
    }
  }, [nuevaPassword, confirmarPassword]);

  // --- Funciones de validación ---
  const validarContrasenia = (password, campos) => {
    // const errores = [];

    if (password.length < 12 || password.length > 20) {
      errores.push("Debe tener entre 12 y 20 caracteres.");
    }
    if (!/[A-Z]/.test(password)) errores.push("Debe contener al menos una letra mayúscula.");
    if (!/[a-z]/.test(password)) errores.push("Debe contener al menos una letra minúscula.");
    if (!/[0-9]/.test(password)) errores.push("Debe contener al menos un número.");
    if (!/[?!@#$%.\-;,&_]/.test(password)) errores.push("Debe contener al menos un carácter especial permitido.");

    const lowerPassword = password.toLowerCase();
    if(campos.length > 0){
      campos.forEach((campo) => {
        if (campo && lowerPassword.includes(campo.toLowerCase())) {
          errores.push("La contraseña no puede contener datos personales.");
        }
      });
    }
    else{
      if(lowerPassword.includes(nombreUsuario))
        errores.push("La contraseña no puede contener datos personales.")
    }

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

  const handleCambiarPassword = () => {
    if (!botonHabilitado) return;

    if (nuevaPassword !== confirmarPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    const datosARevisar = new Array()
    if(localStorage.getItem("esAdmin" === false)){
      datosARevisar.push(nombreUsuario)
      datosARevisar.push(usuario.email)
      datosARevisar.push(usuario.telefono)
      datosARevisar.push(usuario.rut)
      datosARevisar.push(usuario.direccion)
      
    }

    const errores = validarContrasenia(nuevaPassword, datosARevisar);

    if (errores.length > 0) {
      toast.error("Error en la contraseña: " + errores.join(" "));
      return;
    }
    console.log("Cambiando contraseña para usuario:", nombreUsuario);
    console.log("Contraseña actual:", contraseniaActual.current.value);
    console.log("Nueva contraseña:", nuevaPassword);

const body = {
  Nombre: nombreUsuario,
  ContraseniaVieja: contraseniaActual.current.value,
  ContraseniaNueva: nuevaPassword
};

console.log("Payload JSON:", body);

    fetch(`${API_URL}/usuario/cambiarContrasenia`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(body)
})
.then(r => {
  if (!r.ok) throw new Error(r.detail);
  return r;
})
.then(() => {
  toast.success("Contraseña actualizada correctamente");
  setNuevaPassword("");
  setConfirmarPassword("");
  if (localStorage.getItem("esAdmin") === "true") navigate("/inicioAdm");
  else navigate("/inicio");
})
.catch(err => {
  console.error(err);
  toast.error(err.toString());
});

  };

  return (
    <div className="contenedor-menu">
      <div className="contenedor-secundario">
        <h1>Mis Datos</h1>
        <p className="nombre-usuario"><strong>Nombre de usuario:</strong> {nombreUsuario}</p>

        <label>
          Contraseña actual:
          <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={mostrarContrasenia ? "text" : "password"}
            // value={contraseniaActual}
            ref={contraseniaActual}
            placeholder='Contraseña actual'
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
          Nueva contraseña:
          <span
            style={{ marginLeft: "6px", cursor: "pointer", fontSize: "14px", color: "#007bff" }}
            onClick={() => setMostrarInfoContrasenia(!mostrarInfoContrasenia)}
          >
            ℹ️
          </span>
        </label>

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
            type={mostrarContrasenia2 ? "text" : "password"}
            value={nuevaPassword}
            onChange={(e) => {
              setNuevaPassword(e.target.value);
              setNivelSeguridad(obtenerNivelSeguridad(e.target.value));
            }}
            placeholder="Nueva contraseña"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => setMostrarContrasenia2(!mostrarContrasenia2)}
            style={{
              marginLeft: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "10px"
            }}
            title={mostrarContrasenia2 ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {mostrarContrasenia2 ? "🙈" : "👁️"}
          </button>
        </div>

        {nivelSeguridad && (
          <p style={{
            color: nivelSeguridad === "Alta" ? "green" :
                   nivelSeguridad === "Media" ? "orange" : "red"
          }}>
            Seguridad de la contraseña: {nivelSeguridad}
          </p>
        )}

        <label>Confirmar nueva contraseña:</label>
         <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={mostrarContrasenia3 ? "text" : "password"}
            value={confirmarPassword}
            onChange={(e) => {
              setConfirmarPassword(e.target.value);
              setNivelSeguridad(obtenerNivelSeguridad(e.target.value));
            }}
            placeholder="Repetir contraseña"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => setMostrarContrasenia3(!mostrarContrasenia3)}
            style={{
              marginLeft: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "10px"
            }}
            title={mostrarContrasenia3 ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {mostrarContrasenia3 ? "🙈" : "👁️"}
          </button>
        </div>

          <input
          className="btn-contrasenia"
          type="button"
          value="Actualizar contraseña"
          onClick={handleCambiarPassword}
          disabled={!botonHabilitado}
          style={{
            opacity: botonHabilitado ? 1 : 0.5,
            cursor: botonHabilitado ? "pointer" : "not-allowed"
          }}
        />
      </div>
    </div>
  );
};

export default DatosUsuarioAdm;




// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const DatosUsuarioAdm = () => {
//   const [nuevaPassword, setNuevaPassword] = useState("");
//   const [confirmarPassword, setConfirmarPassword] = useState("");
//   const [nombreUsuario, setNombreUsuario] = useState("");
//   const navigate = useNavigate();
//   const API_URL=import.meta.env.VITE_API_URL

//   useEffect(() => {
//     setNombreUsuario(localStorage.getItem("nombre") || "");
//   }, []);

//   const handleCambiarPassword = () => {
//     if (nuevaPassword !== confirmarPassword) {
//       toast.error("Las contraseñas no coinciden.");
//       return;
//     }

//     if (nuevaPassword.length < 6) {
//       toast.warn("La contraseña debe tener al menos 6 caracteres.");
//       return;
//     }

//     const nombre = localStorage.getItem("nombre");

//     fetch(`${API_URL}/usuario/cambiarContraseña?nombre=${encodeURIComponent(nombre)}&contraseña=${encodeURIComponent(nuevaPassword)}`, {
//       method: "PUT",
//       headers: {
//         "Authorization": `Bearer ${localStorage.getItem("token")}`
//       }
//     })
//       .then((r) => {
//         if (!r.ok) throw new Error("Error al cambiar la contraseña");
//         return r;
//       })
//       .then(() => {
//         toast.success("Contraseña actualizada correctamente");
//         setNuevaPassword("");
//         setConfirmarPassword("");
//         navigate("/inicioAdm");
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Error al cambiar la contraseña");
//       });
//   };

//   return (
//     <div className="contenedor-menu">
//       <div className='contenedor-secundario'>
//       {/* <div className="formulario-cambio-contraseña"> */}
//         <h1>Mis Datos</h1>
//         <p className='nombre-usuario'><strong>Nombre de usuario:</strong> {nombreUsuario}</p>

//         <label>Nueva contraseña:</label>
//         <input
//           type="password"
//           value={nuevaPassword}
//           onChange={(e) => setNuevaPassword(e.target.value)}
//           placeholder="Nueva contraseña"
//         />

//         <label>Confirmar nueva contraseña:</label>
//         <input
//           type="password"
//           value={confirmarPassword}
//           onChange={(e) => setConfirmarPassword(e.target.value)}
//           placeholder="Confirmar contraseña"
//         />

//         <input
//           className='btn-contrasenia'
//           type="button"
//           value="Actualizar contraseña"
//           onClick={handleCambiarPassword}
//         />
//       </div>
//     </div>
//   );
// };

// export default DatosUsuarioAdm;

