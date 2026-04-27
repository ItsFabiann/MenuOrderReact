import { createContext, useContext, useState } from 'react'

const CarritoContext = createContext(null)

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([])

  const agregar = (plato) => {
    setItems(prev => {
      const existe = prev.find(i => i.plato.id === plato.id)
      if (existe) {
        return prev.map(i =>
          i.plato.id === plato.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      }
      return [...prev, { plato, cantidad: 1 }]
    })
  }

  const quitar = (platoId) => {
    setItems(prev => {
      const existe = prev.find(i => i.plato.id === platoId)
      if (existe && existe.cantidad > 1) {
        return prev.map(i =>
          i.plato.id === platoId
            ? { ...i, cantidad: i.cantidad - 1 }
            : i
        )
      }
      return prev.filter(i => i.plato.id !== platoId)
    })
  }

  const vaciar = () => setItems([])

  const total = items.reduce((acc, i) => acc + i.plato.precio * i.cantidad, 0)
  const cantidad = items.reduce((acc, i) => acc + i.cantidad, 0)

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, vaciar, total, cantidad }}>
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  return useContext(CarritoContext)
}