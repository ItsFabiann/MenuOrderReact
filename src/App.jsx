import { HashRouter, Routes, Route } from 'react-router-dom'
import { AdminProvider }    from './context/AdminContext'
import { ClienteProvider }  from './context/ClienteContext'
import { CarritoProvider }  from './context/CarritoContext'

import NavbarPublica    from './components/NavbarPublica'
import Footer           from './components/Footer'
import LayoutAdmin      from './components/LayoutAdmin'
import ScrollAlTope from './components/ScrollAlTope'

import Inicio           from './pages/public/Inicio'
import MenuPublico      from './pages/public/MenuPublico'
import SobreNosotros    from './pages/public/SobreNosotros'
import Contacto         from './pages/public/Contacto'
import LoginCliente     from './pages/public/LoginCliente'
import CarritoWeb       from './pages/public/CarritoWeb'
import Checkout         from './pages/public/Checkout'
import PedidoConfirmado from './pages/public/PedidoConfirmado'
import PerfilCliente    from './pages/public/PerfilCliente'

import LoginAdmin  from './pages/admin/LoginAdmin'
import Pedidos     from './pages/admin/Pedidos'
import Platos      from './pages/admin/Platos'
import Clientes    from './pages/admin/Clientes'

function LayoutPublico({ children }) {
  return (
    <>
      <NavbarPublica />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <ClienteProvider>
        <CarritoProvider>
          <HashRouter>
            <ScrollAlTope />
            <Routes>

              {/* Publicas con navbar y footer */}
              <Route path="/" element={<LayoutPublico><Inicio /></LayoutPublico>} />
              <Route path="/menu" element={<LayoutPublico><MenuPublico /></LayoutPublico>} />
              <Route path="/sobre-nosotros" element={<LayoutPublico><SobreNosotros /></LayoutPublico>} />
              <Route path="/contacto" element={<LayoutPublico><Contacto /></LayoutPublico>} />
              <Route path="/carrito" element={<LayoutPublico><CarritoWeb /></LayoutPublico>} />
              <Route path="/perfil"  element={<LayoutPublico><PerfilCliente /></LayoutPublico>} />

              {/* Sin footer para flujo de pago */}
              <Route path="/cliente/login"      element={<LayoutPublico><LoginCliente /></LayoutPublico>} />
              <Route path="/checkout"           element={<LayoutPublico><Checkout /></LayoutPublico>} />
              <Route path="/pedido-confirmado"  element={<LayoutPublico><PedidoConfirmado /></LayoutPublico>} />

              {/* Admin */}
              <Route path="/admin/login" element={<LoginAdmin />} />
              <Route path="/admin" element={<LayoutAdmin />}>
                <Route path="pedidos"  element={<Pedidos />} />
                <Route path="platos"   element={<Platos />} />
                <Route path="clientes" element={<Clientes />} />
              </Route>

            </Routes>
          </HashRouter>
        </CarritoProvider>
      </ClienteProvider>
    </AdminProvider>
  )
}