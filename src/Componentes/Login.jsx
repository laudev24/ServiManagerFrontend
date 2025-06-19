import React from 'react'
import { useRef, useState  } from "react";
import { useDispatch } from "react-redux";
import { guardarApikey } from "../features/usuarioSlice";
import { guardarId } from "../features/usuarioSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

  const [isDisabled, setIsDisabled] = useState(true);
  const campoUsuario = useRef(null);
  const campoPassword = useRef(null);
  const dispatch = useDispatch();
  let navigate = useNavigate();

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
          navigate("/inicioAdm")
          // dispatch(guardarApikey(json.apiKey));
          // dispatch(guardarId(json.id));
        }
        return r.json()
      })
      .then((datos) => {
        console.log(datos)
      })
      .catch((error) => {
        console.error("Error al crear ficha:", error.message); 
      });

  }
  return (
    <div>
      
        <h1>Bienvenido a ServiManager.</h1>
        <h2>Ingresá tu usuario y tu contraseña</h2>
        <label>Usuario:
        <input type="text" ref={campoUsuario} className="txtUsuario" onChange={enableBtnLogin}/>
        </label><br/>
        <label>Contraseña:
        <input type="password" ref={campoPassword} className="txtPass" onChange={enableBtnLogin}/>
        </label><br/>
        <input type="button" value='Login' disabled={isDisabled}  onClick={hacerLogin}/>
        <Link to="/">¿Olvidaste tu contraseña?</Link> 
    </div>
  )
}

export default Login