import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [cargando, setCargando] = useState(true)

  // Cargar admin desde localStorage al iniciar
  useEffect(() => {
    try {
      const guardado = localStorage.getItem('admin')
      if (guardado) {
        setAdmin(JSON.parse(guardado))
      }
    } catch (error) {
      console.error('Error cargando admin:', error)
    } finally {
      setCargando(false)
    }
  }, [])

  const iniciarSesion = (datos) => {
    try {
      localStorage.setItem('admin', JSON.stringify(datos))
      setAdmin(datos)
    } catch (error) {
      console.error('Error guardando admin:', error)
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem('admin')
    setAdmin(null)
  }

  return (
    <AdminContext.Provider value={{ admin, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}