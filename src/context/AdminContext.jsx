import { createContext, useContext, useState } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const guardado = localStorage.getItem('admin')
    return guardado ? JSON.parse(guardado) : null
  })

  const iniciarSesion = (datos) => {
    localStorage.setItem('admin', JSON.stringify(datos))
    setAdmin(datos)
  }

  const cerrarSesion = () => {
    localStorage.removeItem('admin')
    setAdmin(null)
  }

  return (
    <AdminContext.Provider value={{ admin, iniciarSesion, cerrarSesion }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}