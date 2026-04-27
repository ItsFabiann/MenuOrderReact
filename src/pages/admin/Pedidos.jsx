import { useState, useEffect, useRef } from 'react'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import './Pedidos.css'

const ESTADOS = ['Pendiente', 'En preparación', 'Listo', 'Entregado']

export default function Pedidos() {
  const [pedidos, setPedidos]         = useState([])
  const [cargando, setCargando]       = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroCodigo, setFiltroCodigo] = useState('')
  const [expandido, setExpandido]     = useState(null)
  const pedidosAnteriores             = useRef([])
  const esMontura                     = useRef(true)

  const cargar = async () => {
    try {
      const { data } = await api.get('/pedidos')
      // Solo actualizar estado, sin notificaciones
      esMontura.current         = false
      pedidosAnteriores.current = data
      setPedidos(data)
    } catch {
      console.error('Error al cargar pedidos')
    } finally {
      setCargando(false)
    }
  }

  // Polling cada 15 segundos para nuevos pedidos
  useEffect(() => {
    cargar()
    const intervalo = setInterval(cargar, 15000)
    return () => clearInterval(intervalo)
  }, [])

  const actualizarEstado = async (id, estado) => {
    try {
      await api.put(`/pedidos/${id}/estado`, { estado })
      setPedidos(prev =>
        prev.map(p => p.id === id ? { ...p, estado } : p)
      )
    } catch {
      alert('No se pudo actualizar el estado')
    }
  }

  const badgeEstado = (estado) => {
    const mapa = {
      'Pendiente':      'badge-pendiente',
      'En preparación': 'badge-preparacion',
      'Listo':          'badge-listo',
      'Entregado':      'badge-entregado',
    }
    return `badge ${mapa[estado] || 'badge-pendiente'}`
  }

  const formatFecha = (str) => {
  try {
    if (!str) return ''

    // Si no tiene zona horaria, asumir UTC
    const iso = str.includes('Z') || str.includes('+')
      ? str
      : str + 'Z'

    return new Date(iso).toLocaleString('es-PE', {
      timeZone: 'America/Lima',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return str
  }
}

  // Filtrar por estado y código
  const pedidosFiltrados = pedidos
    .filter(p => filtroEstado === 'Todos' || p.estado === filtroEstado)
    .filter(p =>
      filtroCodigo === '' ||
      p.codigoPedido.toLowerCase().includes(filtroCodigo.toLowerCase()) ||
      p.emailCliente.toLowerCase().includes(filtroCodigo.toLowerCase()) ||
      p.mesa.toLowerCase().includes(filtroCodigo.toLowerCase())
    )

  if (cargando) return <Spinner />

  return (
    <div className="pedidos-page">
      <div className="page-header">
        <div>
          <h1 className="page-titulo">Pedidos</h1>
          <p className="page-subtitulo">{pedidos.length} pedidos en total</p>
        </div>
        <button className="btn-secundario" onClick={cargar}>Actualizar</button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="pedidos-controles">
        <input
          type="text"
          className="buscador-input"
          placeholder="Buscar por codigo, correo o mesa..."
          value={filtroCodigo}
          onChange={e => setFiltroCodigo(e.target.value)}
        />
        <div className="pedidos-filtros">
          {['Todos', ...ESTADOS].map(e => (
            <button
              key={e}
              className={`filtro-btn${filtroEstado === e ? ' activo' : ''}`}
              onClick={() => setFiltroEstado(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {pedidosFiltrados.length === 0
        ? <p className="sin-datos">No hay pedidos con estos filtros</p>
        : (
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Cliente</th>
                  <th>Mesa</th>
                  <th>Total</th>
                  <th>Metodo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Cambiar estado</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map(pedido => (
                  <>
                    <tr key={pedido.id}>
                      <td data-label="Codigo"><strong>{pedido.codigoPedido}</strong></td>
                      <td data-label="Cliente">{pedido.emailCliente}</td>
                      <td data-label="Mesa">{pedido.mesa}</td>
                      <td data-label="Total">S/ {pedido.total.toFixed(2)}</td>
                      <td data-label="Metodo">{pedido.metodoPago}</td>
                      <td data-label="Fecha">{formatFecha(pedido.fechaPedido)}</td>
                      <td data-label="Estado">
                        <span className={badgeEstado(pedido.estado)}>
                          {pedido.estado}
                        </span>
                      </td>
                      <td data-label="Cambiar estado">
                        <select
                          className="estado-select"
                          value={pedido.estado}
                          onChange={e => actualizarEstado(pedido.id, e.target.value)}
                        >
                          {ESTADOS.map(e => (
                            <option key={e} value={e}>{e}</option>
                          ))}
                        </select>
                      </td>
                      <td data-label="Detalle">
                        <button
                          className="btn-detalle"
                          onClick={() =>
                            setExpandido(prev =>
                              prev === pedido.id ? null : pedido.id
                            )
                          }
                        >
                          {expandido === pedido.id ? 'Cerrar' : 'Ver items'}
                        </button>
                      </td>
                    </tr>

                    {/* Fila expandida con los items */}
                    {expandido === pedido.id && (
                      <tr key={`${pedido.id}-items`} className="fila-expandida">
                        <td colSpan={9}>
                          <div className="items-pedido">
                            <div className="items-pedido-titulo">
                              Contenido del pedido — {pedido.codigoPedido}
                            </div>
                            {pedido.items && pedido.items.length > 0
                              ? (
                                <table className="items-tabla">
                                  <thead>
                                    <tr>
                                      <th>Plato</th>
                                      <th>Cantidad</th>
                                      <th>Precio unitario</th>
                                      <th>Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {pedido.items.map((item, i) => (
                                      <tr key={i}>
                                        <td>{item.nombrePlato}</td>
                                        <td>{item.cantidad}</td>
                                        <td>S/ {item.precio.toFixed(2)}</td>
                                        <td>S/ {item.subtotal.toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <td colSpan={3}><strong>Total</strong></td>
                                      <td><strong>S/ {pedido.total.toFixed(2)}</strong></td>
                                    </tr>
                                  </tfoot>
                                </table>
                              )
                              : <p className="sin-items">Sin items registrados</p>
                            }
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}