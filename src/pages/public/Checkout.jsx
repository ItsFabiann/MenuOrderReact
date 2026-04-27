import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useCarrito } from '../../context/CarritoContext'
import { useCliente } from '../../context/ClienteContext'
import './Checkout.css'

export default function Checkout() {
  const { items, total }  = useCarrito()
  const { cliente }       = useCliente()
  const navigate          = useNavigate()

  const [mesa, setMesa]           = useState('')
  const [metodo, setMetodo]       = useState('Tarjeta')
  const [error, setError]         = useState('')

  // Tarjeta
  const [nombreTarjeta, setNombreTarjeta] = useState('')
  const [numeroTarjeta, setNumeroTarjeta] = useState('')
  const [mesTarjeta, setMesTarjeta]       = useState('')
  const [anioTarjeta, setAnioTarjeta]     = useState('')
  const [cvv, setCvv]                     = useState('')

  // Yape
  const [numYape, setNumYape] = useState('')
  const [codYape, setCodYape] = useState('')

  if (!cliente)           return <Navigate to="/cliente/login" replace />
  if (items.length === 0) return <Navigate to="/menu" replace />

  // Formatear número de tarjeta con espacios cada 4 dígitos
  const handleNumeroTarjeta = (e) => {
    const soloDigitos = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formateado  = soloDigitos.replace(/(.{4})/g, '$1 ').trim()
    setNumeroTarjeta(formateado)
  }

  const validar = () => {
    const mesaNum = parseInt(mesa)
    if (!mesa || isNaN(mesaNum) || mesaNum < 1 || mesaNum > 20) {
      setError('Ingresa un número de mesa válido (1 al 20)')
      return false
    }
    if (metodo === 'Tarjeta') {
      if (nombreTarjeta.trim().length < 3) {
        setError('Ingresa el nombre en la tarjeta'); return false
      }
      const digitos = numeroTarjeta.replace(/\s/g, '')
      if (digitos.length !== 16) {
        setError('El número de tarjeta debe tener 16 dígitos'); return false
      }
      const mesNum = parseInt(mesTarjeta)
      if (mesTarjeta.length !== 2 || mesNum < 1 || mesNum > 12) {
        setError('Mes inválido (01-12)'); return false
      }
      const anioNum = parseInt(anioTarjeta)
      if (anioTarjeta.length !== 2 || anioNum < 26) {
        setError('Año inválido'); return false
      }
      if (cvv.length !== 3) {
        setError('CVV debe tener 3 dígitos'); return false
      }
    }
    if (metodo === 'Yape') {
      const digitosYape = numYape.replace(/\D/g, '')
      if (digitosYape.length !== 9) {
        setError('Número Yape debe tener 9 dígitos'); return false
      }
      if (codYape.length < 4) {
        setError('Código de aprobación inválido'); return false
      }
    }
    return true
  }

  const handlePagar = () => {
    setError('')
    if (!validar()) return

    // En lugar de llamar a la API aquí, navegamos a la pantalla de procesamiento
    // y le pasamos los datos necesarios
    navigate('/procesando-pago', {
      state: {
        dataPago: {
          mesa:   `Mesa ${parseInt(mesa)}`,
          metodo,
        },
        items,
        total
      }
    })
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
          <div className="checkout-form">

            {/* Mesa */}
            <div className="tarjeta checkout-seccion">
              <h3 className="checkout-seccion-titulo">Número de mesa</h3>
              <div className="campo">
                <label>Mesa en la que estás sentado</label>
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
              <h3 className="checkout-seccion-titulo">Método de pago</h3>

              <div className="metodo-tabs">
                {['Tarjeta', 'Yape'].map(m => (
                  <button
                    key={m}
                    type="button"
                    className={`metodo-tab${metodo === m ? ' activo' : ''}`}
                    onClick={() => { setMetodo(m); setError('') }}
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
                    <label>Número de tarjeta (16 dígitos)</label>
                    <input
                      value={numeroTarjeta}
                      onChange={handleNumeroTarjeta}
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                      maxLength={19}
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
                        maxLength={2}
                      />
                    </div>
                    <div className="campo">
                      <label>Año (AA)</label>
                      <input
                        value={anioTarjeta}
                        onChange={limitarDigitos(setAnioTarjeta, 2)}
                        placeholder="AA"
                        inputMode="numeric"
                        maxLength={2}
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
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {metodo === 'Yape' && (
                <div className="pago-form">
                  <div className="campo">
                    <label>Número de Yape (9 dígitos)</label>
                    <input
                      value={numYape}
                      onChange={limitarDigitos(setNumYape, 9)}
                      placeholder="9XXXXXXXX"
                      inputMode="numeric"
                      maxLength={9}
                    />
                  </div>
                  <div className="campo">
                    <label>Código de aprobación</label>
                    <input
                      value={codYape}
                      onChange={limitarDigitos(setCodYape, 6)}
                      placeholder="123456"
                      inputMode="numeric"
                      maxLength={6}
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
              >
                Pagar S/ {total.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}