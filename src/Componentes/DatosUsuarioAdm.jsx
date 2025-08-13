import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DatosUsuarioAdm = () => {
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navigate = useNavigate();
  const API_URL=import.meta.env.VITE_API_URL

  useEffect(() => {
    setNombreUsuario(localStorage.getItem("nombre") || "");
  }, []);

  const handleCambiarPassword = () => {
    if (nuevaPassword !== confirmarPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    if (nuevaPassword.length < 6) {
      toast.warn("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const nombre = localStorage.getItem("nombre");

    fetch(`${API_URL}/usuario/cambiarContraseña?nombre=${encodeURIComponent(nombre)}&contraseña=${encodeURIComponent(nuevaPassword)}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((r) => {
        if (!r.ok) throw new Error("Error al cambiar la contraseña");
        return r;
      })
      .then(() => {
        toast.success("Contraseña actualizada correctamente");
        setNuevaPassword("");
        setConfirmarPassword("");
        navigate("/inicioAdm");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error al cambiar la contraseña");
      });
  };

  return (
    <div className="contenedor-menu">
      <div className="formulario-cambio-contraseña">
        <h1>Mis Datos</h1>
        <p><strong>Nombre de usuario:</strong> {nombreUsuario}</p>

        <label>Nueva contraseña:</label>
        <input
          type="password"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          placeholder="Nueva contraseña"
        />

        <label>Confirmar nueva contraseña:</label>
        <input
          type="password"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          placeholder="Confirmar contraseña"
        />

        <input
          type="button"
          value="Actualizar contraseña"
          onClick={handleCambiarPassword}
        />
      </div>
    </div>
  );
};

export default DatosUsuarioAdm;

