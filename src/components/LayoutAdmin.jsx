import { Navigate, Outlet } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import SidebarAdmin from './SidebarAdmin'
import './LayoutAdmin.css'
import { useState, useEffect } from 'react'

export default function LayoutAdmin() {
  const { admin } = useAdmin()
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVerificando(false), 100)
    return () => clearTimeout(timer)
  }, [])

  if (verificando) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Cargando...
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