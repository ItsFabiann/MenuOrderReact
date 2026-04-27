import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../../context/CarritoContext'
import { useCliente } from '../../context/ClienteContext'
import './CarritoWeb.css'

export default function CarritoWeb() {
  const { items, agregar, quitar, total, cantidad } = useCarrito()
  const { cliente }  = useCliente()
  const navigate     = useNavigate()

  const handlePagar = () => {
    if (!cliente) {
      navigate('/cliente/login')
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="carrito-vacio">
        <div className="carrito-vacio-inner">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h2>Tu carrito esta vacío</h2>
          <p>Agrega platos desde el menú para continuar</p>
          <Link to="/menu" className="btn-primario">Ver el menu</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="carrito-web">
      <div className="carrito-web-inner">
        <h1 className="carrito-titulo">Tu pedido</h1>
        <p className="carrito-sub">{cantidad} {cantidad === 1 ? 'plato' : 'platos'}</p>

        <div className="carrito-layout">
          {/* Lista de items */}
          <div className="carrito-items">
            {items.map(({ plato, cantidad: cant }) => (
              <div key={plato.id} className="carrito-item">
                <div className="carrito-item-img">
                  {plato.imagenUrl
                    ? <img src={plato.imagenUrl} alt={plato.nombre} />
                    : <div className="carrito-item-img-placeholder" />
                  }
                </div>
                <div className="carrito-item-info">
                  <div className="carrito-item-nombre">{plato.nombre}</div>
                  <div className="carrito-item-precio">S/ {plato.precio.toFixed(2)} c/u</div>
                </div>
                <div className="carrito-item-controles">
                  <button onClick={() => quitar(plato.id)} className="ctrl-btn">−</button>
                  <span className="ctrl-cantidad">{cant}</span>
                  <button onClick={() => agregar(plato)} className="ctrl-btn">+</button>
                </div>
                <div className="carrito-item-subtotal">
                  S/ {(plato.precio * cant).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="carrito-resumen">
            <div className="tarjeta">
              <h3 className="carrito-resumen-titulo">Resumen</h3>
              <div className="carrito-resumen-fila">
                <span>Subtotal</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <div className="carrito-resumen-fila">
                <span>Servicio</span>
                <span>Incluido</span>
              </div>
              <div className="carrito-resumen-total">
                <span>Total</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <button className="btn-primario carrito-btn-pagar" onClick={handlePagar}>
                {cliente ? 'Continuar al pago' : 'Ingresar para pagar'}
              </button>
              <Link to="/menu" className="carrito-seguir">Seguir eligiendo platos</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}