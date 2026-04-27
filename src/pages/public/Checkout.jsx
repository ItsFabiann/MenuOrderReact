import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useCarrito } from '../../context/CarritoContext'
import { useCliente } from '../../context/ClienteContext'
import api from '../../api/axios'
import './Checkout.css'

export default function Checkout() {
  const { items, total, vaciar }  = useCarrito()
  const { cliente }               = useCliente()
  const navigate                  = useNavigate()

  const [mesa, setMesa]           = useState('')
  const [metodo, setMetodo]       = useState('Tarjeta')
  const [procesando, setProcesando] = useState(false)
  const [error, setError]         = useState('')

  // Tarjeta
  const [nombreTarjeta, setNombreTarjeta] = useState('')
  const [numeroTarjeta, setNumeroTarjeta] = useState('')
  const [mesTarjeta, setMesTarjeta]       = useState('')
  const [anioTarjeta, setAnioTarjeta]     = useState('')
  const [cvv, setCvv]                     = useState('')

  // Yape
  const [numYape, setNumYape]     = useState('')
  const [codYape, setCodYape]     = useState('')

  if (!cliente)       return <Navigate to="/cliente/login" replace />
  if (items.length === 0) return <Navigate to="/menu" replace />

  const validar = () => {
    if (!mesa || isNaN(mesa) || parseInt(mesa) < 1 || parseInt(mesa) > 20) {
      setError('Ingresa un numero de mesa valido (1 al 20)')
      return false
    }
    if (metodo === 'Tarjeta') {
      if (nombreTarjeta.trim().length < 3) { setError('Ingresa el nombre en la tarjeta'); return false }
      if (numeroTarjeta.replace(/\s/g, '').length !== 16) { setError('El numero de tarjeta debe tener 16 digitos'); return false }
      if (mesTarjeta.length !== 2 || parseInt(mesTarjeta) < 1 || parseInt(mesTarjeta) > 12) { setError('Mes invalido (01-12)'); return false }
      if (anioTarjeta.length !== 2 || parseInt(anioTarjeta) < 26) { setError('Año invalido'); return false }
      if (cvv.length !== 3) { setError('CVV debe tener 3 digitos'); return false }
    }
    if (metodo === 'Yape') {
      if (numYape.replace(/\s/g, '').length !== 9) { setError('Numero Yape debe tener 9 digitos'); return false }
      if (codYape.length < 4) { setError('Codigo de aprobacion invalido'); return false }
    }
    return true
  }

  const handlePagar = async () => {
    setError('')
    if (!validar()) return

    setProcesando(true)
    try {
      const payload = {
        mesa:         `Mesa ${parseInt(mesa)}`,
        emailCliente: cliente.email,
        metodoPago:   metodo,
        items:        items.map(i => ({ platoId: i.plato.id, cantidad: i.cantidad }))
      }
      const { data } = await api.post('/pedidos', payload)
      vaciar()
      navigate('/pedido-confirmado', { state: { pedido: data } })
    } catch {
      setError('No se pudo procesar el pedido. Intenta de nuevo.')
    } finally {
      setProcesando(false)
    }
  }

  const limitarDigitos = (setter, max) => (e) => {
    const val = e.target.value.replace(/\D/g, '')
    if (val.length <= max) setter(val)
  }

  return (
    <div className="checkout">
      <div className="checkout-inner">
        <h1 className="checkout-titulo">Confirmar pedido</h1>

        <div className="checkout-layout">

          {/* Formulario */}
          <div className="checkout-form">

            {/* Mesa */}
            <div className="tarjeta checkout-seccion">
              <h3 className="checkout-seccion-titulo">Numero de mesa</h3>
              <div className="campo">
                <label>Mesa en la que estas sentado</label>
                <input
                  type="number"
                  min="1" max="20"
                  value={mesa}
                  onChange={e => setMesa(e.target.value)}
                  placeholder="Ej: 5"
                />
              </div>
            </div>

            {/* Método de pago */}
            <div className="tarjeta checkout-seccion">
              <h3 className="checkout-seccion-titulo">Metodo de pago</h3>

              <div className="metodo-tabs">
                {['Tarjeta', 'Yape'].map(m => (
                  <button
                    key={m}
                    className={`metodo-tab${metodo === m ? ' activo' : ''}`}
                    onClick={() => { setMetodo(m); setError('') }}
                    type="button"
                  >
                    {m}
                  </button>
                ))}
              </div>

              {metodo === 'Tarjeta' && (
                <div className="pago-form">
                  <div className="campo">
                    <label>Nombre en la tarjeta</label>
                    <input
                      value={nombreTarjeta}
                      onChange={e => setNombreTarjeta(e.target.value.toUpperCase())}
                      placeholder="JUAN PEREZ"
                      maxLength={30}
                    />
                  </div>
                  <div className="campo">
                    <label>Numero de tarjeta (16 digitos)</label>
                    <input
                      value={numeroTarjeta}
                      onChange={limitarDigitos(setNumeroTarjeta, 16)}
                      placeholder="1234567890123456"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="pago-fila">
                    <div className="campo">
                      <label>Mes (MM)</label>
                      <input
                        value={mesTarjeta}
                        onChange={limitarDigitos(setMesTarjeta, 2)}
                        placeholder="MM"
                        inputMode="numeric"
                      />
                    </div>
                    <div className="campo">
                      <label>Año (AA)</label>
                      <input
                        value={anioTarjeta}
                        onChange={limitarDigitos(setAnioTarjeta, 2)}
                        placeholder="AA"
                        inputMode="numeric"
                      />
                    </div>
                    <div className="campo">
                      <label>CVV</label>
                      <input
                        value={cvv}
                        onChange={limitarDigitos(setCvv, 3)}
                        placeholder="123"
                        inputMode="numeric"
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              )}

              {metodo === 'Yape' && (
                <div className="pago-form">
                  <div className="campo">
                    <label>Numero de Yape (9 digitos)</label>
                    <input
                      value={numYape}
                      onChange={limitarDigitos(setNumYape, 9)}
                      placeholder="9XXXXXXXX"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="campo">
                    <label>Codigo de aprobacion</label>
                    <input
                      value={codYape}
                      onChange={limitarDigitos(setCodYape, 6)}
                      placeholder="123456"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              )}
            </div>

            {error && <p className="error-texto">{error}</p>}
          </div>

          {/* Resumen */}
          <div className="checkout-resumen">
            <div className="tarjeta">
              <h3 className="checkout-seccion-titulo">Resumen del pedido</h3>
              <div className="checkout-items">
                {items.map(({ plato, cantidad: cant }) => (
                  <div key={plato.id} className="checkout-item">
                    <span>{plato.nombre} x{cant}</span>
                    <span>S/ {(plato.precio * cant).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="checkout-total">
                <span>Total</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <button
                className="btn-primario checkout-btn"
                onClick={handlePagar}
                disabled={procesando}
              >
                {procesando ? 'Procesando...' : `Pagar S/ ${total.toFixed(2)}`}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}