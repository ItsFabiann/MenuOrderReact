import { Navigate, Outlet } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import SidebarAdmin from './SidebarAdmin'
import './LayoutAdmin.css'

export default function LayoutAdmin() {
  const { admin } = useAdmin()

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