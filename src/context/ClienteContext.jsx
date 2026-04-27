import { createContext, useContext, useState } from 'react'

const ClienteContext = createContext(null)

export function ClienteProvider({ children }) {
  const [cliente, setCliente] = useState(() => {
    const guardado = localStorage.getItem('cliente')
    return guardado ? JSON.parse(guardado) : null
  })

  const iniciarSesion = (datos) => {
    localStorage.setItem('cliente', JSON.stringify(datos))
    setCliente(datos)
  }

  const cerrarSesion = () => {
    localStorage.removeItem('cliente')
    setCliente(null)
  }

  return (
    <ClienteContext.Provider value={{ cliente, iniciarSesion, cerrarSesion }}>
      {children}
    </ClienteContext.Provider>
  )
}

export function useCliente() {
  return useContext(ClienteContext)
}