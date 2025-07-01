import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store';
import './Estilo.css'

import Estructura from './Componentes/Estructura';
import Login from './Componentes/Login'
import NoEncontrado from './Componentes/NoEncontrado'

// const Login = lazy(() => import('./Componentes/Login'));
// const NoEncontrado = lazy(() => import('./Componentes/NoEncontrado'));
const InicioAdm = lazy(() => import('./Componentes/InicioAdm'));
const Inicio = lazy(() => import('./Componentes/Inicio'));
const Clientes = lazy(() => import('./Componentes/Clientes'));
const NuevoCliente = lazy(() => import('./Componentes/NuevoCliente'));
const Chat = lazy(() => import('./Componentes/Chat'));
const Chats = lazy(() => import('./Componentes/Chats'));
const DatosUsuario = lazy(() => import('./Componentes/DatosUsuario'));
const FichasTecnicas = lazy(() => import('./Componentes/FichasTecnicas'));
const Insumos = lazy(() => import('./Componentes/Insumos'));
const Maquinas = lazy(() => import('./Componentes/Maquinas'));
const Mensaje = lazy(() => import('./Componentes/Mensaje'));
const Solicitudes = lazy(() => import('./Componentes/Solicitudes'));
const NuevaMaquina = lazy(() => import('./Componentes/NuevaMaquina'));
const ModificarMaquina = lazy(() => import('./Componentes/ModificarMaquina'));
const ModificarCliente = lazy(() => import('./Componentes/ModificarCliente'));
const ModificarFicha = lazy(() => import('./Componentes/ModificarFicha'));
const VerCliente = lazy(() => import('./Componentes/VerCliente'));
const VerMaquina = lazy(() => import('./Componentes/VerMaquina'));
const VerFichaTecnica = lazy(() => import('./Componentes/VerFichaTecnica'));
const AsociarMaquinas = lazy(() => import('./Componentes/AsociarMaquinas'));
const AsociarCliente = lazy(() => import('./Componentes/AsociarCliente'));
const NuevaFichaTecnica = lazy(() => import('./Componentes/NuevaFichaTecnica'));
const FichasMaquina = lazy(() => import('./Componentes/FichasMaquina'));
// import InicioAdm from './Componentes/InicioAdm'
// import Clientes from './Componentes/Clientes'
// import NuevoCliente from './Componentes/NuevoCliente'
// import Chat from './Componentes/Chat'
// import Chats from './Componentes/Chats'
// import DatosUsuario from './Componentes/DatosUsuario'
// import FichasTecnicas from './Componentes/FichasTecnicas'
// import Insumos from './Componentes/Insumos'
// import Maquinas from './Componentes/Maquinas'
// import Mensaje from './Componentes/Mensaje'
// import Solicitudes from './Componentes/Solicitudes'
// import NuevaMaquina from  './Componentes/NuevaMaquina'
// import ModificarMaquina from './Componentes/ModificarMaquina'
// import ModificarCliente from './Componentes/ModificarCliente'
// import ModificarFicha from './Componentes/ModificarFicha'
// import VerCliente from './Componentes/VerCliente'
// import VerMaquina from './Componentes/VerMaquina'
// import VerFichaTecnica from './Componentes/VerFichaTecnica'
// import AsociarMaquinas from './Componentes/AsociarMaquinas';
// import AsociarCliente from './Componentes/AsociarCliente';
// import NuevaFichaTecnica from './Componentes/NuevaFichaTecnica';
// import FichasMaquina from './Componentes/FichasMaquina';




function App() {

  return (
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Suspense fallback={<div>Cargando página...</div>}>
          <Routes>
            {/* Ruta pública (Login) */}
            <Route path="/" element={<Login />} />

            {/* Rutas protegidas con layout */}
            <Route path="/" element={<Estructura />}>
              <Route path="inicioAdm" element={<InicioAdm />} />
              <Route path="inicio" element={<Inicio />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="verCliente/:id" element={<VerCliente />} />
              <Route path="verMaquina/:id" element={<VerMaquina />} />
              <Route path="verFichaTecnica/:id" element={<VerFichaTecnica />} />
              <Route path="nuevoCliente" element={<NuevoCliente />} />
              <Route path="nuevaMaquina" element={<NuevaMaquina />} />
              <Route path="nuevaFichaTecnica" element={<NuevaFichaTecnica />} />
              <Route path="chat" element={<Chat />} />
              <Route path="chats" element={<Chats />} />
              <Route path="datosUsuario" element={<DatosUsuario />} />
              <Route path="fichasTecnicas" element={<FichasTecnicas />} />
              <Route path="insumos" element={<Insumos />} />
              <Route path="maquinas" element={<Maquinas />} />
              <Route path="modificarMaquina/:id" element={<ModificarMaquina />} />
              <Route path="modificarCliente/:id" element={<ModificarCliente />} />
              <Route path="modificarFicha/:id" element={<ModificarFicha />} />
              <Route path="mensaje" element={<Mensaje />} />
              <Route path="solicitudes" element={<Solicitudes />} />
              <Route path="asociarMaquinas/:id" element={<AsociarMaquinas />} />
              <Route path="asociarCliente/:id" element={<AsociarCliente />} />
              <Route path="fichasMaquina/:id" element={<FichasMaquina />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NoEncontrado />} />
          </Routes>

        </Suspense>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        />
      <ToastContainer />
      </PersistGate>
    </Provider>
    
  )
}

export default App
