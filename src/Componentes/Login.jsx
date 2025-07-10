import React, { useEffect } from 'react'
import { useRef, useState  } from "react";
import { useDispatch } from "react-redux";
import { guardarNombre, guardarToken, guardarTipoUsuario } from "../features/usuarioSlice";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guardarClienteId } from '../features/clienteSlice';

const Login = () => {

  const [isDisabled, setIsDisabled] = useState(true);
  const campoUsuario = useRef(null);
  const campoPassword = useRef(null);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const location = useLocation();
  const fromLogout = location.state?.fromLogout;

  useEffect(() => {
   if(fromLogout && localStorage.getItem("token")){
      localStorage.removeItem("token");
      localStorage.removeItem("nombre");
    }
    setIsDisabled(true);
    campoUsuario.current.value = "";  
    campoPassword.current.value = "";
    campoUsuario.current.focus();
    console.log("Desde Logout:", fromLogout);
  }, [fromLogout])
  

  const enableBtnLogin = () => {
    if(campoPassword.current.value != "" && campoUsuario.current.value != ""){
        setIsDisabled(false);
    }
  }

  const hacerLogin = () => {
    const usuario = {
      nombre : campoUsuario.current.value,
      contraseña : campoPassword.current.value
    }

      fetch("https://localhost:5201/api/login/login", {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then(async r =>{
         const contentType = r.headers.get("content-type");

      // Si la respuesta es JSON
      if (contentType && contentType.includes("application/json")) {
        const data = await r.json();
        if (!r.ok) {
          toast.error(data.message || data.error || "Error en la respuesta del servidor");
          throw new Error(data.message || data.error || "Error en la respuesta del servidor");
        }
        return data;
      } else {
        // Si es texto plano
        const text = await r.text();
        if (!r.ok) {
          toast.error(text || "Error en la respuesta del servidor");
          throw new Error(text || "Error en la respuesta del servidor");
        }
        throw new Error("Respuesta inesperada del servidor");
      }
    })
       
      .then((datos) => {
        console.log(datos)
        localStorage.setItem("token", datos.token)
        localStorage.setItem("nombre", datos.nombre)
        localStorage.setItem("esAdmin", datos.esAdmin)
        dispatch(guardarToken(datos.token));
        dispatch(guardarNombre(datos.nombre));
        dispatch(guardarTipoUsuario(datos.esAdmin));
        if(datos.esAdmin === false){
          buscarCliente(datos.token);
          navigate("/inicio");
        }
        else if(datos.esAdmin === true){
          navigate("/inicioAdm")
        }
      })
  }

  const buscarCliente = (token) => {
    const nombre = campoUsuario.current.value;
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
      
      dispatch(guardarClienteId(datos.id));
    })
    .catch(error => {
      console.error("Error al obtener el cliente:", error);
    })
  }


  return (
    <div className="contenedor-login">
      <div className="card-login">
        <h1>Bienvenido a ServiManager</h1>
        <h2>Ingresá tu usuario y tu contraseña</h2>

        <div className="form-group">
          <label>Usuario </label>
          <input
            type="text"
            ref={campoUsuario}
            className="form-control"
            onChange={enableBtnLogin}
          />
        </div>

        <div className="form-group">
          <label>Contraseña </label>
          <input
            type="password"
            ref={campoPassword}
            className="form-control"
            onChange={enableBtnLogin}
          />
        </div>

        <button
          className="btn btn-primary btn-login"
          disabled={isDisabled}
          onClick={hacerLogin}
        >
          Login
        </button>

        <Link to="/" className="enlace-recuperar">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </div>

  )
}

export default Login