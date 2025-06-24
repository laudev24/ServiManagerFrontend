import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { ToastContainer } from 'react-toastify';
import './Estilo.css'
import Login from './Componentes/Login'
import NoEncontrado from './Componentes/NoEncontrado'
import InicioAdm from './Componentes/InicioAdm'
import Clientes from './Componentes/Clientes'
import NuevoCliente from './Componentes/NuevoCliente'
import Chat from './Componentes/Chat'
import Chats from './Componentes/Chats'
import DatosUsuario from './Componentes/DatosUsuario'
import FichasTecnicas from './Componentes/FichasTecnicas'
import Insumos from './Componentes/Insumos'
import Maquinas from './Componentes/Maquinas'
import Mensaje from './Componentes/Mensaje'
import Solicitudes from './Componentes/Solicitudes'
import NuevaMaquina from  './Componentes/NuevaMaquina'
import ModificarMaquina from './Componentes/ModificarMaquina'
import ModificarCliente from './Componentes/ModificarCliente'
import ModificarFicha from './Componentes/ModificarFicha'
import VerCliente from './Componentes/VerCliente'
import VerMaquina from './Componentes/VerMaquina'
import VerFichaTecnica from './Componentes/VerFichaTecnica'
import AsociarMaquinas from './Componentes/AsociarMaquinas';
import AsociarCliente from './Componentes/AsociarCliente';
import NuevaFichaTecnica from './Componentes/NuevaFichaTecnica';
import FichasMaquina from './Componentes/FichasMaquina';




function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
            <Route path = "/" element={<Login/>}/>
            <Route path = "/inicioAdm" element={<InicioAdm/>}/>
            <Route path = "/clientes" element={<Clientes/>}/>
            <Route path = "/verCliente/:id" element={<VerCliente/>}/>
            <Route path = "/verMaquina/:id" element={<VerMaquina/>}/>
            <Route path = "/verFichaTecnica/:id" element={<VerFichaTecnica/>}/>
            <Route path = "/nuevoCliente" element={<NuevoCliente/>}/>
            <Route path = "/nuevaMaquina" element={<NuevaMaquina/>}/>
            <Route path = "/nuevaFichaTecnica" element={<NuevaFichaTecnica/>}/>
            <Route path = "/chat" element={<Chat/>}/>
            <Route path = "/chats" element={<Chats/>}/>
            <Route path = "/datosUsuario" element={<DatosUsuario/>}/>
            <Route path = "/fichasTecnicas" element={<FichasTecnicas/>}/>
            <Route path = "/insumos" element={<Insumos/>}/>
            <Route path = "/maquinas" element={<Maquinas/>}/>
            <Route path = "/modificarMaquina/:id" element={<ModificarMaquina/>}/>
            <Route path = "/modificarCliente/:id" element={<ModificarCliente/>}/>
            <Route path = "/modificarFicha/:id" element={<ModificarFicha/>}/>
            <Route path = "/mensaje" element={<Mensaje/>}/>
            <Route path = "/solicitudes" element={<Solicitudes/>}/>
            <Route path = "/asociarMaquinas/:id" element={<AsociarMaquinas/>}/>
            <Route path = "/asociarCliente/:id" element={<AsociarCliente/>}/>
            <Route path = "/fichasMaquina/:id" element={<FichasMaquina/>}/>

            <Route path="*" element={<NoEncontrado/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        />
      <ToastContainer />
    </Provider>
    
  )
}

export default App
