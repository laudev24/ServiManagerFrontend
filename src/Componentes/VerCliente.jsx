import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { guardarCategorias } from '../features/categoriasSlice'
import { toast } from 'react-toastify'

const VerCliente = () => {
    const { id } = useParams()
    const dispatch = useDispatch()

    const categorias = useSelector(state => state.categoriasSlice.categorias)
    const [categoria, setCategoria] = useState("")
    const [cliente, setCliente] = useState("")
    const [maquinasAsociadas, setMaquinasAsociadas] = useState([])

    useEffect(() => {
        fetch(`https://localhost:5201/api/cliente/${id}`)
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
    }, [cliente])

    useEffect(() => {
     fetch(`https://localhost:5201/api/cliente/maquinas-del-cliente?id=${id}`)
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

    }, [maquinasAsociadas])
    

    useEffect(() => {
          fetch("https://localhost:5201/api/categoria")
            .then(r =>{
              if(!r.ok){
                  throw new Error("Error en la respuesta del servidor");
              }
              return r.json()
              })
            .then(datos => {
                dispatch(guardarCategorias(datos))
            })
        
    }, [categorias])

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

        fetch(`https://localhost:5201/api/arrendamiento/${id}/${idMaquina}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
        },
        })
        .then(async (r) => {
            if (r.status === 204) {
                toast(`Máquina ${maq.numero} desasociada.`);
                console.log(r.status)
                
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

    
    return (
        <div>
            <h1>Datos del cliente</h1>
            <Link to ={`/modificarCliente/${id}`}>Modificar Cliente</Link><br />
            <Link to ={`/asociarMaquinas/${id}`}>Asociar Máquinas</Link>
            <table>
                <tbody>
                    <tr>
                        <th>Nombre de la empresa: </th>
                        <td>{cliente.nombreEmpresa}</td>
                    </tr> 
                        <tr>
                        <th>Categoría: </th>
                        <td>{categoria?.nombre}</td>
                    </tr> 
                        <tr>
                        <th>Dirección: </th>
                        <td>{cliente.direccion}</td>
                    </tr> 
                        <tr>
                        <th>Nombre del contacto: </th>
                        <td>{cliente.nombreContacto}</td>
                    </tr> 
                        <tr>
                        <th>Teléfono/Celular de contacto: </th>
                        <td>{cliente.telefono}</td>
                    </tr>
                        <tr>
                        <th>Correo electrónico: </th>
                        <td>{cliente.email}</td>
                    </tr>
                        <tr>
                        <th>RUT: </th>
                        <td>{cliente.rut}</td>
                    </tr>  
                        <tr>
                        <th>Fecha de pago: </th>
                        <td>{cliente.fechaPago}</td>
                    </tr>  
                        <tr>
                        <th>Nombre de usuario: </th>
                        <td>{cliente.fechaPago}</td>
                    </tr>  
                </tbody>
            
                
            </table>
            <h2>Máquinas asociadas:</h2>
            <table>
                <tbody>
                    {maquinasAsociadas.map((maq) => (
                        <tr key={maq.id}>
                            <td>{maq.numero}</td>
                            <td> <button onClick={() => mostrarToast(maq.id)}  style={{ color: "red" }}>Desasociar </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default VerCliente