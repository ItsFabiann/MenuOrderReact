import { useLocation, Link } from 'react-router-dom'
import './PedidoConfirmado.css'

export default function PedidoConfirmado() {
  const { state } = useLocation()
  const pedido    = state?.pedido

  if (!pedido) return <Link to="/" className="btn-primario" style={{margin:'40px auto',display:'block',width:'fit-content'}}>Volver al inicio</Link>

  return (
    <div className="confirmado">
      <div className="confirmado-card">
        <div className="confirmado-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>

        <h1 className="confirmado-titulo">Pedido confirmado</h1>
        <p className="confirmado-sub">Tu pedido ha sido recibido por el restaurante</p>

        <div className="confirmado-codigo">
          {pedido.codigoPedido}
        </div>
        <p className="confirmado-codigo-label">Muestra este codigo al recoger tu pedido</p>

        <div className="confirmado-detalles">
          <div className="confirmado-fila">
            <span>Mesa</span>
            <span>{pedido.mesa}</span>
          </div>
          <div className="confirmado-fila">
            <span>Total pagado</span>
            <span>S/ {pedido.total.toFixed(2)}</span>
          </div>
          <div className="confirmado-fila">
            <span>Método de pago</span>
            <span>{pedido.metodoPago}</span>
          </div>
          <div className="confirmado-fila">
            <span>Estado</span>
            <span className="badge badge-pendiente">{pedido.estado}</span>
          </div>
        </div>

        <div className="confirmado-acciones">
          <Link to="/perfil" className="btn-secundario">Ver mis pedidos</Link>
          <Link to="/menu"   className="btn-primario">Volver al menú</Link>
        </div>
      </div>
    </div>
  )
}