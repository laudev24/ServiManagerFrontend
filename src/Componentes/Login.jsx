import React, { useEffect } from 'react'
import { useRef, useState  } from "react";
import { useDispatch } from "react-redux";
import { guardarNombre, guardarToken, guardarTipoUsuario } from "../features/usuarioSlice";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

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
      .then(r =>{
        if(!r.ok){
          throw new Error("Error en la respuesta del servidor");

        }
        else if(r.status===200){
          
        }
        return r.json()
      })
      .then((datos) => {
        console.log(datos)
        localStorage.setItem("token", datos.token)
        localStorage.setItem("nombre", datos.nombre)
        localStorage.setItem("esAdministrador", datos.esAdministrador)
        dispatch(guardarToken(datos.token));
        dispatch(guardarNombre(datos.nombre));
        dispatch(guardarTipoUsuario(datos.esAdministrador));
        if(datos.esAdministrador === false){
          navigate("/inicio");
        }
        else if(datos.esAdministrador === true){
          navigate("/inicioAdm")
        }
      })
      .catch((error) => {
        toast.error("Usuario o contraseña incorrectos. Por favor, intente nuevamente.");
        console.error("Error al hacer login:", error.message); 
      });

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
    // <div id="login">
      
    //     <h1>Bienvenido a ServiManager.</h1>
    //     <h2>Ingresá tu usuario y tu contraseña</h2>
    //     <label>Usuario:
    //     <input type="text" ref={campoUsuario} className="txtUsuario" onChange={enableBtnLogin}/>
    //     </label><br/>
    //     <label>Contraseña:
    //     <input type="password" ref={campoPassword} className="txtPass" onChange={enableBtnLogin}/>
    //     </label><br/>
    //     <input type="button" value='Login' disabled={isDisabled}  onClick={hacerLogin}/>
    //     <Link to="/">¿Olvidaste tu contraseña?</Link> 
    // </div>
  )
}

export default Login