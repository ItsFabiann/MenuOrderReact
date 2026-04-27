import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import './SidebarAdmin.css'

const enlaces = [
  { ruta: '/admin/pedidos',  etiqueta: 'Pedidos' },
  { ruta: '/admin/platos',   etiqueta: 'Platos' },
  { ruta: '/admin/clientes', etiqueta: 'Clientes' },
]

export default function SidebarAdmin() {
  const { admin, cerrarSesion } = useAdmin()
  const navigate                = useNavigate()
  const [abierto, setAbierto]   = useState(false)

  const handleSalir = () => {
    cerrarSesion()
    navigate('/admin/login')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">MenuOrder</div>
        <div className="sidebar-admin-info">
          <div className="sidebar-admin-nombre">{admin?.nombre}</div>
          <div className="sidebar-admin-rol">Administrador</div>
        </div>
        <nav className="sidebar-nav">
          {enlaces.map(({ ruta, etiqueta }) => (
            <NavLink
              key={ruta}
              to={ruta}
              className={({ isActive }) =>
                'sidebar-enlace' + (isActive ? ' activo' : '')
              }
            >
              {etiqueta}
            </NavLink>
          ))}
        </nav>
        <button className="sidebar-salir" onClick={handleSalir}>
          Cerrar sesión
        </button>
      </aside>

      {/* Mobile topbar */}
      <div className="sidebar-mobile">
        <div className="sidebar-mobile-top">
          <div className="sidebar-logo-mobile">MenuOrder Admin</div>
          <button
            className="sidebar-mobile-toggle"
            onClick={() => setAbierto(prev => !prev)}
          >
            {abierto ? 'Cerrar' : 'Menu'}
          </button>
        </div>

        {abierto && (
          <div className="sidebar-mobile-menu">
            {enlaces.map(({ ruta, etiqueta }) => (
              <NavLink
                key={ruta}
                to={ruta}
                className={({ isActive }) =>
                  'sidebar-mobile-enlace' + (isActive ? ' activo' : '')
                }
                onClick={() => setAbierto(false)}
              >
                {etiqueta}
              </NavLink>
            ))}
            <button className="sidebar-mobile-salir" onClick={handleSalir}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </>
  )
}