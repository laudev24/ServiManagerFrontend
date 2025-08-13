import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store';
import './Estilo.css'

import Estructura from './Componentes/Estructura';
import Login from './Componentes/Login'
import NoEncontrado from './Componentes/NoEncontrado'
import { reiniciarDatos } from './ReiniciarDatos';
import RequireAuthAdm from './RequireAuthAdm';
import RequireAuthCli from './RequireAuthCli';

const InicioAdm = lazy(() => import('./Componentes/InicioAdm'));
const Inicio = lazy(() => import('./Componentes/Inicio'));
const Clientes = lazy(() => import('./Componentes/Clientes'));
const NuevoCliente = lazy(() => import('./Componentes/NuevoCliente'));
const NuevoInsumo = lazy(() => import('./Componentes/NuevoInsumo'));
const Chat = lazy(() => import('./Componentes/Chat'));
const Chats = lazy(() => import('./Componentes/Chats'));
const DatosUsuarioAdm = lazy(() => import('./Componentes/DatosUsuarioAdm'));
const FichasTecnicas = lazy(() => import('./Componentes/FichasTecnicas'));
const Insumos = lazy(() => import('./Componentes/Insumos'));
const Maquinas = lazy(() => import('./Componentes/Maquinas'));
const Mensaje = lazy(() => import('./Componentes/Mensaje'));
const Solicitudes = lazy(() => import('./Componentes/Solicitudes'));
const MisSolicitudes = lazy(() => import('./Componentes/MisSolicitudes'));
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
const NuevaSolicitud = lazy(() => import('./Componentes/NuevaSolicitud'));
const EnviarContador = lazy(() => import('./Componentes/EnviarContador'));
const ContadoresEnviados = lazy(() => import('./Componentes/ContadoresEnviados'));
const ContadoresRecibidos = lazy(() => import('./Componentes/ContadoresRecibidos'))
const InformacionContadores = lazy(() => import('./Componentes/InformacionContadores'))
const Pagos = lazy(() => import('./Componentes/Pagos'));



function App() {

 
  useEffect(() => {
    reiniciarDatos();
  }, []);

  return (
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Suspense fallback={<div>Cargando página...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/" element={<Estructura />}>
              <Route path="inicioAdm" element={<RequireAuthAdm><InicioAdm /></RequireAuthAdm>} />
              <Route path="inicio" element={<RequireAuthCli><Inicio /></RequireAuthCli>} />
              <Route path="clientes" element={<RequireAuthAdm><Clientes /></RequireAuthAdm>} />
              <Route path="verCliente/:id" element={<RequireAuthAdm><VerCliente /></RequireAuthAdm>} />
              <Route path="verMaquina/:id" element={<RequireAuthAdm><VerMaquina /></RequireAuthAdm>} />
              <Route path="verFichaTecnica/:id" element={<RequireAuthAdm><VerFichaTecnica /></RequireAuthAdm>} />
              <Route path="nuevoCliente" element={<RequireAuthAdm><NuevoCliente /></RequireAuthAdm>} />
              <Route path="nuevaMaquina" element={<RequireAuthAdm><NuevaMaquina /></RequireAuthAdm>} />
              <Route path="nuevaFichaTecnica" element={<RequireAuthAdm><NuevaFichaTecnica /></RequireAuthAdm>} />
              <Route path="nuevaSolicitud" element={<RequireAuthCli><NuevaSolicitud /></RequireAuthCli>} />
              <Route path="nuevoInsumo" element={<RequireAuthAdm><NuevoInsumo /></RequireAuthAdm>} />
              <Route path="chat" element={<Chat />} />
              <Route path="chats" element={<Chats />} />
              <Route path="datosUsuarioAdm" element={<RequireAuthAdm><DatosUsuarioAdm /></RequireAuthAdm>} />
              <Route path="fichasTecnicas" element={<RequireAuthAdm><FichasTecnicas /></RequireAuthAdm>} />
              <Route path="insumos" element={<RequireAuthAdm><Insumos /></RequireAuthAdm>} />
              <Route path="maquinas" element={<RequireAuthAdm><Maquinas /></RequireAuthAdm>} />
              <Route path="modificarMaquina/:id" element={<RequireAuthAdm><ModificarMaquina /></RequireAuthAdm>} />
              <Route path="modificarCliente/:id" element={<RequireAuthAdm><ModificarCliente /></RequireAuthAdm>} />
              <Route path="modificarFicha/:id" element={<RequireAuthAdm><ModificarFicha /></RequireAuthAdm>} />
              <Route path="misSolicitudes" element={<RequireAuthCli><MisSolicitudes /></RequireAuthCli>} />
              <Route path="mensaje" element={<Mensaje />} />
              <Route path="solicitudes" element={<Solicitudes />} />
              <Route path="asociarMaquinas/:id" element={<RequireAuthAdm><AsociarMaquinas /></RequireAuthAdm>} />
              <Route path="asociarCliente/:id" element={<RequireAuthAdm><AsociarCliente /></RequireAuthAdm>} />
              <Route path="fichasMaquina/:id" element={<RequireAuthAdm><FichasMaquina /></RequireAuthAdm>} />
              <Route path="enviarContador" element={<RequireAuthCli><EnviarContador /></RequireAuthCli>} />
              <Route path="contadoresEnviados" element={<RequireAuthCli><ContadoresEnviados /></RequireAuthCli>} />
              <Route path="contadoresRecibidos" element={<RequireAuthAdm><ContadoresRecibidos/></RequireAuthAdm>} />
              <Route path="informacionContadores" element={<RequireAuthAdm><InformacionContadores/></RequireAuthAdm>} />
              <Route path="pagos/:id" element={<RequireAuthAdm><Pagos/></RequireAuthAdm>} />

            </Route>

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
