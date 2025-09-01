import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PagosCliente = () => {
  const { id } = useParams();
  const [pagos, setPagos] = useState([]);
  const [montos, setMontos] = useState({});
  const token = localStorage.getItem("token");
  const API_URL=import.meta.env.VITE_API_URL

  const cargarPagos = () => {
    fetch(`${API_URL}/pago/cliente/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(r => {
        if (!r.ok) throw new Error("Error al obtener pagos");
        return r.json();
      })
      .then(data => {
        const ordenados = data.sort((a, b) => {
          if (a.confirmado === b.confirmado) return 0;
          return a.confirmado ? 1 : -1;
        });
        setPagos(ordenados);
      })
      .catch(err => {
        console.error(err);
        toast.error("No se pudieron cargar los pagos");
      });
  };

  useEffect(() => {
    console.log(id);
    cargarPagos();
  }, [id]);

  const handleMontoChange = (idPago, valor) => {
    setMontos(prev => ({ ...prev, [idPago]: valor }));
  };

  const saldarPago = (pago) => {
    const montoIngresado = parseFloat(montos[pago.id]);

    if (isNaN(montoIngresado) || montoIngresado <= 0) {
      toast.warn("Ingrese un monto válido");
      return;
    }

    
    const pagoConMonto = { ...pago, monto: montoIngresado };

    fetch(`${API_URL}/pago/${pago.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(pagoConMonto)
    })
      .then(r => {
        if (!r.ok) throw new Error("Error al saldar el pago");
        return r.json();
      })
      .then(() => {
        toast.success("Pago actualizado");
        setMontos(prev => ({ ...prev, [pago.id]: "" }));
        cargarPagos();
      })
      .catch(err => {
        console.error(err);
        toast.error("No se pudo saldar el pago");
      });
  };

  return (
    <div className="contenedor-menu">
  <div className="contenedor-secundario">
    <h1>Pagos del cliente</h1>
    {/* <table> */}
    <table className="tabla-responsive">
      <thead>
        <tr>
          <th>Total</th>
          <th>Confirmado</th>
          <th>Ingresar monto</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {pagos.map(pago => (
          <tr key={pago.id}>
            <td>{pago.valor}</td>
            <td>{pago.confirmado ? "✅" : "❌"}</td>
            <td>
              <input
                type="number"
                className="input-monto"
                value={montos[pago.id] || ""}
                onChange={(e) => handleMontoChange(pago.id, e.target.value)}
              />
            </td>
            <td>
              <button onClick={() => saldarPago(pago)}>Saldar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default PagosCliente;