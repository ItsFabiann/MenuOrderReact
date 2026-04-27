import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useCliente } from '../../context/ClienteContext'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import './PerfilCliente.css'

export default function PerfilCliente() {
  const { cliente }             = useCliente()
  const [pedidos, setPedidos]   = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!cliente) return
    api.get(`/pedidos/cliente/${cliente.email}`)
      .then(r => setPedidos(r.data))
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [cliente])

  if (!cliente) return <Navigate to="/cliente/login" replace />

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
    const fecha = new Date(str)
    // Restar 5 horas manualmente (UTC-5 = Perú)
    const fechaPeru = new Date(fecha.getTime() - (5 * 60 * 60 * 1000))
    return fechaPeru.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return str
  }
}

  return (
    <div className="perfil-cliente">
      <div className="perfil-header">
        <div className="perfil-header-inner">
          <div className="perfil-avatar">{cliente.nombre.charAt(0).toUpperCase()}</div>
          <div>
            <h1 className="perfil-nombre">{cliente.nombre}</h1>
            <p className="perfil-email">{cliente.email}</p>
          </div>
        </div>
      </div>

      <div className="perfil-contenido">
        <h2 className="perfil-seccion-titulo">Historial de pedidos</h2>

        {cargando && <Spinner />}

        {!cargando && pedidos.length === 0 && (
          <div className="perfil-sin-pedidos">
            <p>Aun no tienes pedidos registrados</p>
          </div>
        )}

        {!cargando && pedidos.length > 0 && (
          <div className="perfil-pedidos">
            {pedidos.map(pedido => (
              <div key={pedido.id} className="pedido-card">
                <div className="pedido-card-header">
                  <div className="pedido-codigo">{pedido.codigoPedido}</div>
                  <span className={badgeEstado(pedido.estado)}>{pedido.estado}</span>
                </div>
                <div className="pedido-card-body">
                  <div className="pedido-dato">
                    <span className="pedido-dato-label">Mesa</span>
                    <span>{pedido.mesa}</span>
                  </div>
                  <div className="pedido-dato">
                    <span className="pedido-dato-label">Total</span>
                    <span className="pedido-total">S/ {pedido.total.toFixed(2)}</span>
                  </div>
                  <div className="pedido-dato">
                    <span className="pedido-dato-label">Método</span>
                    <span>{pedido.metodoPago}</span>
                  </div>
                  <div className="pedido-dato">
                    <span className="pedido-dato-label">Fecha</span>
                    <span>{formatFecha(pedido.fechaPedido)}</span>
                  </div>
                </div>
                {pedido.items?.length > 0 && (
                  <div className="pedido-items">
                    {pedido.items.map((item, i) => (
                      <span key={i} className="pedido-item-tag">
                        {item.nombrePlato} x{item.cantidad}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}