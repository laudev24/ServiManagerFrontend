import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { guardarCategorias } from '../features/categoriasSlice'
import { toast } from 'react-toastify'

const VerCliente = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    let navigate = useNavigate()
    const token = localStorage.getItem("token")
    const API_URL=import.meta.env.VITE_API_URL
    const categorias = useSelector(state => state.categoriasSlice.categorias)
    const [categoria, setCategoria] = useState("")
    const [cliente, setCliente] = useState("")
    const [maquinasAsociadas, setMaquinasAsociadas] = useState([])
    const [mostrarDatosCliente, setMostrarDatosCliente] = useState(true);


    const traerCliente = () => {
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
            setCliente(datos)
        })
        .catch(error => {
            console.error("Error al obtener el cliente:", error);
        })
    }
    useEffect(() => {
       
        if(cliente==="")traerCliente()
        if(maquinasAsociadas.length===0)traerMaquinasDelCliente()
        if(categorias.length===0)traerCategorias()
    }, [])

    const traerMaquinasDelCliente = () => {
     fetch(`${API_URL}/cliente/maquinas-del-cliente?id=${id}`, {
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
            setMaquinasAsociadas(datos)
        })
        .catch(error => {
        console.error("Error al obtener las maquinas:", error);
        })

    }
    
    const traerCategorias = () => {
          fetch(`${API_URL}/categoria`, {
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
                dispatch(guardarCategorias(datos))
            })
        
    }

    useEffect(() => {
       const cat = categorias.find(c => c.id === cliente.categoria)
        setCategoria(cat)
        console.log("cliente: ", cliente)
        console.log("categoria: ", cat)

    }, [cliente, categorias])
    
    

   

    const ConfirmToast = ({ onConfirm, onCancel, idMaquina }) => (
        <div>
            <p>¿Estás seguro que deseas desasociar la máquina {idMaquina}?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={onConfirm}>Sí</button>
            <button onClick={onCancel}>No</button>
            </div>
        </div>
    )

    const mostrarToast = (idMaquina) => {
        const id = toast(
            <ConfirmToast
                onConfirm={() => {
                toast.dismiss(id);
                console.log('Confirmado');
                desasociar(idMaquina)
                }}
                onCancel={() => {
                toast.dismiss(id);
                console.log('Cancelado');
                }}
            />,
            { autoClose: false }
        );
    };

    const desasociar = (idMaquina) => {
        const maq = maquinasAsociadas.find(c => c.id === Number(idMaquina))

        fetch(`${API_URL}/arrendamiento/${id}/${idMaquina}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        })
        .then(async (r) => {
            if (r.status === 204) {
                toast(`Máquina ${maq.numero} desasociada.`);
                console.log(r.status)
                traerMaquinasDelCliente()
                
            } else {
                console.log(r.status)
                toast(r.mensaje || "Error desasociando máquina");
            }
        })
        .catch((err) => {
            console.log("Error en la conexión: " + err)
            toast("Error de conexión al desasociar máquina");
        });
    }

    const irAContadoresRecibidos = () => {
      navigate("/contadoresRecibidos")
    }

    const irAInformacionContadores = () => {
      navigate(`/informacionContadores`)
    }

    const irAPagos = () => {
      navigate(`/pagos/${cliente.id}`);
    }

    const irAAsociarMaquinas = () => {
      navigate(`/asociarMaquinas/${cliente.id}`);
    }

    const irAModificarCliente = () => {
      navigate(`/modificarCliente/${cliente.id}`);
    }

    
    return (
    <div className="contenedor-menu">

<div className="contenedor-secundario">
  <h1>Datos del cliente {cliente.nombreEmpresa}</h1>
    <button onClick={irAModificarCliente}>Modificar Cliente</button>
    <button className="btn-contrasenia" onClick={() => setMostrarDatosCliente(prev => !prev)} >
    {mostrarDatosCliente ? 'Ocultar datos del cliente' : 'Mostrar datos del cliente'}
    </button>
{mostrarDatosCliente && (
  <table>
    <tbody>
      <tr>
        <th>Nombre de la empresa:</th>
        <td data-label="Empresa">{cliente.nombreEmpresa}</td>
      </tr>
      <tr>
        <th>Categoría:</th>
        <td data-label="Categoría">{categoria?.nombre}</td>
      </tr>
      <tr>
        <th>Dirección:</th>
        <td data-label="Dirección">{cliente.direccion}</td>
      </tr>
      <tr>
        <th>Nombre del contacto:</th>
        <td data-label="Nombre del Contacto">{cliente.nombreContacto}</td>
      </tr>
      <tr>
        <th>Teléfono / Celular:</th>
        <td data-label="Teléfono / Celular">{cliente.telefono}</td>
      </tr>
      <tr>
        <th>Correo electrónico:</th>
        <td data-label="correo electrónico">{cliente.email}</td>
      </tr>
      <tr>
        <th>RUT:</th>
        <td data-label="RUT">{cliente.rut}</td>
      </tr>
      <tr>
        <th>Fecha de pago:</th>
        <td data-label="Fecha de pago">{cliente.fechaPago}</td>
      </tr>
      <tr>
        <th>Nombre de usuario:</th>
        <td data-label="Nombre de usuario">{cliente.fechaPago}</td>
      </tr>
    </tbody>
  </table>
)}


  <h2 className='ver-cliente-h2'>Máquinas asociadas:</h2>
  <table>
    <tbody>
      {maquinasAsociadas.map((maq) => (
        <tr key={maq.id}>
          <td>
            <Link to={`/verMaquina/${maq.id}`}>{maq.numero}</Link>
          </td>
          <td>
            <button className="eliminar" onClick={() => mostrarToast(maq.id)}>
              Desasociar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table><br />

  <div className='ultimos-botones'>
  <button onClick={irAAsociarMaquinas}>Asociar Máquina</button>
  <button onClick={irAContadoresRecibidos}>Contadores recibidos</button>
  <button onClick={irAInformacionContadores}>Información Contadores</button>
  <button onClick={irAPagos}>Pagos</button>
</div>
</div>
</div>

    )
}

export default VerCliente