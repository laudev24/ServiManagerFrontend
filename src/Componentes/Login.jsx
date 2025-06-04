import React from 'react'
import { useRef, useState  } from "react";
import { useDispatch } from "react-redux";
import { guardarApikey } from "../features/usuarioSlice";
import { guardarId } from "../features/usuarioSlice";

import { useNavigate } from "react-router-dom";

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

      fetch("https://#################/login.php", {
      method: 'POST',
      body: JSON.stringify({
          "usuario":campoUsuario.current.value,
          "password":campoPassword.current.value
      }),
      headers: {
          'Content-type': 'application/json; charset=UTF-8',
      },
      })
      .then((response) => response.json())
      .then((json) => {
          if(json.codigo===200){
              localStorage.setItem("apikey", json.apiKey)
              localStorage.setItem("id", json.id)
              navigate("/inicioAdm")
              dispatch(guardarApikey(json.apiKey));
              dispatch(guardarId(json.id));

          }
          else {
              alert(json.mensaje)
          }
      })

  }
  return (
    <div>
      <h1>Login</h1>
      <h1>¡Hola!</h1>
        <h2>Bienvenido a ServiManager.</h2>
        <h3>Ingresá tu usuario y tu contraseña</h3>
        <label>Usuario:
        <input type="text" ref={campoUsuario} className="txtUsuario" onChange={enableBtnLogin}/>
        </label><br/>
        <label>Contraseña:
        <input type="password" ref={campoPassword} className="txtPass" onChange={enableBtnLogin}/>
        </label><br/>
        <input type="button" value='Login' disabled={isDisabled}  onClick={hacerLogin}/>
        {/* <a href="################">¿Olvidaste tu contraseña?</a> */}
    </div>
  )
}

export default Login