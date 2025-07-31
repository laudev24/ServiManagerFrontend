import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const NuevoInsumo = () => {
  const token = localStorage.getItem("token")
  const campoNombre = useRef("");
  const campoCantidad = useRef("");
  const navigate = useNavigate();

  useEffect(() => {
    
  }, [token]);

  const registrarInsumo = () => {
    const nombre = campoNombre.current.value.trim();
    const cantidad = Number(campoCantidad.current.value);

    if (!nombre || isNaN(cantidad) || cantidad < 0) {
      toast.error("Por favor, complete correctamente los campos");
      return;
    }

    const insumo = {
      nombreInsumo: nombre,
      cantidad: cantidad
    };

    fetch("https://localhost:5201/api/insumo", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(insumo)
    })
      .then(response => {
        if (response.status === 201) {
          toast.success("Insumo registrado con éxito");
          navigate("/insumos");
        } else {
          return response.json().then(data => {
            throw new Error(data.message || "Error al registrar insumo");
          });
        }
      })
      .catch(error => {
        console.error("Error al registrar insumo:", error);
        toast.error(error.message);
      });
  };

  return (
    <div className="contenedor-menu">
      <div className="formulario-cliente">
        <h1>Registrar Insumo</h1>

        <label>
          Nombre del Insumo:
          <input type="text" ref={campoNombre} />
        </label>

        <label>
          Cantidad:
          <input type="number" ref={campoCantidad} min="0" />
        </label>

        <input type="button" value="Registrar" onClick={registrarInsumo} />
      </div>
    </div>
  );
};

export default NuevoInsumo;