import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useCliente } from '../context/ClienteContext'
import './NavbarPublica.css'

export default function NavbarPublica() {
  const { pathname }               = useLocation()
  const { cantidad }               = useCarrito()
  const { cliente, cerrarSesion }  = useCliente()
  const navigate                   = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const cerrar = () => setMenuAbierto(false)

  const handleSalir = () => {
    cerrarSesion()
    cerrar()
    navigate('/')
  }

  const links = [
    { to: '/',               label: 'Inicio' },
    { to: '/menu',           label: 'Menu' },
    { to: '/sobre-nosotros', label: 'El restaurante' },
    { to: '/contacto',       label: 'Contacto' },
  ]

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={cerrar}>MenuOrder</Link>

        {/* Links desktop */}
        <nav className="navbar-links">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={pathname === to ? 'activo' : ''}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Acciones desktop */}
        <div className="navbar-acciones">
          <Link to="/carrito" className="navbar-carrito">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cantidad > 0 && (
              <span className="navbar-carrito-badge">{cantidad}</span>
            )}
          </Link>

          {cliente ? (
            <div className="navbar-cliente">
              <Link to="/perfil" className="navbar-cliente-nombre">
                {cliente.nombre.split(' ')[0]}
              </Link>
              <button className="navbar-salir" onClick={handleSalir}>Salir</button>
            </div>
          ) : (
            <Link to="/cliente/login" className="btn-primario navbar-btn">
              Ingresar
            </Link>
          )}

          <Link to="/admin/login" className="navbar-admin-link">Admin</Link>
        </div>

        {/* Botón hamburguesa mobile */}
        <button
          className={`navbar-hamburguesa${menuAbierto ? ' abierto' : ''}`}
          onClick={() => setMenuAbierto(prev => !prev)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Menú mobile desplegable */}
      {menuAbierto && (
        <div className="navbar-mobile">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`navbar-mobile-link${pathname === to ? ' activo' : ''}`}
              onClick={cerrar}
            >
              {label}
            </Link>
          ))}

          <div className="navbar-mobile-separador" />

          <Link to="/carrito" className="navbar-mobile-link" onClick={cerrar}>
            Carrito {cantidad > 0 && `(${cantidad})`}
          </Link>

          {cliente ? (
            <>
              <Link to="/perfil" className="navbar-mobile-link" onClick={cerrar}>
                Mi perfil — {cliente.nombre.split(' ')[0]}
              </Link>
              <button className="navbar-mobile-salir" onClick={handleSalir}>
                Cerrar sesion
              </button>
            </>
          ) : (
            <Link to="/cliente/login" className="navbar-mobile-link destacado" onClick={cerrar}>
              Ingresar
            </Link>
          )}

          <Link to="/admin/login" className="navbar-mobile-link" onClick={cerrar}
            style={{ color: 'var(--gris-medio)', fontSize: '0.85rem' }}>
            Acceso administrador
          </Link>
        </div>
      )}
    </header>
  )
}