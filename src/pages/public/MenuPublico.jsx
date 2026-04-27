import { useState, useEffect } from 'react'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import { useCarrito } from '../../context/CarritoContext'
import './MenuPublico.css'

const CATEGORIAS = [
  { id: 0, nombre: 'Todos' },
  { id: 1, nombre: 'Entradas' },
  { id: 2, nombre: 'Fondos' },
  { id: 3, nombre: 'Bebidas' },
  { id: 4, nombre: 'Postres' },
]

export default function MenuPublico() {
  const [platos, setPlatos]       = useState([])
  const [cargando, setCargando]   = useState(true)
  const [categoria, setCategoria] = useState(0)
  const [error, setError]         = useState('')
  const { agregar }               = useCarrito()
  const [agregados, setAgregados] = useState({})

  useEffect(() => {
  const cargarPlatos = () => {
    api.get('/platos')
      .then(r => setPlatos(r.data))
      .catch(() => setError('No se pudo cargar el menu.'))
      .finally(() => setCargando(false))
  }

  cargarPlatos()

  // Recargar cuando el usuario vuelve a la pestaña
  window.addEventListener('focus', cargarPlatos)
  return () => window.removeEventListener('focus', cargarPlatos)
}, [])

  const platosFiltrados = categoria === 0
    ? platos
    : platos.filter(p => p.categoriaId === categoria)

  const handleAgregar = (plato) => {
    agregar(plato)
    setAgregados(prev => ({ ...prev, [plato.id]: true }))
    setTimeout(() => {
      setAgregados(prev => ({ ...prev, [plato.id]: false }))
    }, 1500)
  }

  return (
    <div className="menu-publico">
      <div className="menu-header">
        <div className="menu-header-inner">
          <h1>Nuestro Menu</h1>
          <p>Explora nuestra seleccion de platos preparados con ingredientes frescos</p>
        </div>
      </div>

      <div className="menu-contenido">
        <div className="menu-filtros">
          {CATEGORIAS.map(cat => (
            <button
              key={cat.id}
              className={`filtro-btn${categoria === cat.id ? ' activo' : ''}`}
              onClick={() => setCategoria(cat.id)}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {cargando && <Spinner />}
        {error && <p className="error-texto" style={{ textAlign: 'center' }}>{error}</p>}

        {!cargando && !error && (
          <>
            <p className="menu-cantidad">{platosFiltrados.length} platos</p>
            <div className="menu-grid">
              {platosFiltrados.map(plato => (
                <div key={plato.id} className="plato-card">
                  <div className="plato-imagen">
                    {plato.imagenUrl
                      ? <img src={plato.imagenUrl} alt={plato.nombre} />
                      : <div className="plato-imagen-placeholder" />
                    }
                    <div className="plato-categoria">{plato.categoria}</div>
                  </div>
                  <div className="plato-info">
                    <h3 className="plato-nombre">{plato.nombre}</h3>
                    <p className="plato-descripcion">{plato.descripcion}</p>
                    <div className="plato-pie">
                      <span className="plato-precio">S/ {plato.precio.toFixed(2)}</span>
                      <button
                        className={`plato-agregar${agregados[plato.id] ? ' agregado' : ''}`}
                        onClick={() => handleAgregar(plato)}
                      >
                        {agregados[plato.id] ? 'Agregado' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}