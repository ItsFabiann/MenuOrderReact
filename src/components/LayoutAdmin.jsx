import { Navigate, Outlet } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import SidebarAdmin from './SidebarAdmin'
import './LayoutAdmin.css'

export default function LayoutAdmin() {
  const { admin, cargando } = useAdmin()

  // Mostrar loading mientras verifica autenticación
  if (cargando) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Cargando panel admin...
      </div>
    )
  }

  if (!admin) return <Navigate to="/admin/login" replace />

  return (
    <div className="layout-admin">
      <SidebarAdmin />
      <main className="layout-admin-contenido">
        <Outlet />
      </main>
    </div>
  )
}