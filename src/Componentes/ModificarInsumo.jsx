import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { modificarInsumo } from "../features/insumosSlice";

const ModificarInsumo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

    const dispatch = useDispatch();

    const [insumo, setInsumo] = useState({ nombreInsumo: "", cantidad: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/insumo/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (r) => {
                if (!r.ok) {
                    const errorMsg = await r.text();
                    throw new Error(errorMsg || "No se pudo cargar el insumo");
                }
                return r.json();
            })
            .then((data) => {
                setInsumo({ nombreInsumo: data.nombreInsumo || "", cantidad: data.cantidad || "" });
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInsumo((prev) => ({ ...prev, [name]: value }));
    };

    const handleModificar = (e) => {
        e.preventDefault();

        fetch(`${API_URL}/insumo/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                nombreInsumo: insumo.nombreInsumo,
                cantidad: parseInt(insumo.cantidad),
            }),
        })
            .then(async (r) => {
                if (!r.ok) {
                    const errorMsg = await r.text();
                    throw new Error(errorMsg || "Error al modificar insumo");
                }
                return r.json();
            })
            .then((insumoActualizado) => {
                dispatch(modificarInsumo(insumoActualizado));

                toast.success("Insumo modificado correctamente");
                navigate("/insumos");
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.message);
            });
    };

    if (loading) return <p>Cargando insumo...</p>;

    return (
        <div className="formulario-cliente">
            <h1>Modificar Insumo</h1>
            <form onSubmit={handleModificar}>
                <div className="campo-formulario">
                    <label>Nombre del insumo</label>
                    <input
                        type="text"
                        name="nombreInsumo"
                        value={insumo.nombreInsumo}
                        onChange={handleChange}
                    />
                </div>
                <div className="campo-formulario">
                    <label>Cantidad</label>
                    <input
                        type="number"
                        name="cantidad"
                        value={insumo.cantidad}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Guardar cambios</button>
            </form>
        </div>
    );
};

export default ModificarInsumo;
