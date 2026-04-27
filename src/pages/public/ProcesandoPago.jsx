import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useCarrito } from '../../context/CarritoContext'
import { useCliente } from '../../context/ClienteContext'
import api from '../../api/axios'
import './ProcesandoPago.css'

const PASOS = [
  { progreso: 15,  mensaje: 'Conectando con el restaurante...' },
  { progreso: 35,  mensaje: 'Verificando tu pedido...' },
  { progreso: 55,  mensaje: 'Procesando el método de pago...' },
  { progreso: 75,  mensaje: 'El restaurante recibió tu orden...' },
  { progreso: 90,  mensaje: 'Generando tu código de pedido...' },
  { progreso: 100, mensaje: '¡Pedido confirmado!' },
]

export default function ProcesandoPago() {
  const { state }              = useLocation()
  const navigate               = useNavigate()
  const { vaciar }             = useCarrito()
  const { cliente }            = useCliente()

  const [pasoActual, setPasoActual]   = useState(0)
  const [completado, setCompletado]   = useState(false)
  const [pedidoFinal, setPedidoFinal] = useState(null)
  const [error, setError]             = useState('')

  // Si llegan sin datos de pago, redirigir
  if (!state?.dataPago || !state?.items) {
    return <Navigate to="/menu" replace />
  }

  const { dataPago, items, total } = state

  useEffect(() => {
    let indice = 0

    const avanzar = setInterval(() => {
      if (indice < PASOS.length - 1) {
        indice++
        setPasoActual(indice)
      }
    }, 900)

    // Llamar a la API en paralelo
    const payload = {
      mesa:         dataPago.mesa,
      emailCliente: cliente.email,
      metodoPago:   dataPago.metodo,
      items:        items.map(i => ({
        platoId:  i.plato.id,
        cantidad: i.cantidad
      }))
    }

    api.post('/pedidos', payload)
      .then(({ data }) => {
        clearInterval(avanzar)
        setPasoActual(PASOS.length - 1)
        setTimeout(() => {
          setCompletado(true)
          setPedidoFinal(data)
          vaciar()
        }, 800)
      })
      .catch(() => {
        clearInterval(avanzar)
        setError('No se pudo procesar el pedido. Intenta de nuevo.')
      })

    return () => clearInterval(avanzar)
  }, [])

  const handleVerPedido = () => {
    navigate('/pedido-confirmado', { state: { pedido: pedidoFinal } })
  }

  const progreso = PASOS[pasoActual]?.progreso ?? 0
  const mensaje  = PASOS[pasoActual]?.mensaje  ?? ''

  if (error) {
    return (
      <div className="procesando-wrapper">
        <div className="procesando-card">
          <div className="procesando-error-icono">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h2 className="procesando-titulo">Algo salió mal</h2>
          <p className="procesando-sub">{error}</p>
          <button
            className="btn-primario procesando-btn"
            onClick={() => navigate('/checkout', { state })}
          >
            Volver al pago
          </button>
        </div>
      </div>
    )
  }

  if (completado && pedidoFinal) {
    return (
      <div className="procesando-wrapper">
        <div className="procesando-card">
          <div className="procesando-exito-icono">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>

          <h2 className="procesando-titulo">Pedido confirmado</h2>
          <p className="procesando-sub">
            Tu pedido fue recibido por el restaurante
          </p>

          <div className="procesando-codigo">
            {pedidoFinal.codigoPedido}
          </div>
          <p className="procesando-codigo-hint">
            Muestra este código al recoger tu pedido
          </p>

          <div className="procesando-resumen">
            <div className="procesando-resumen-fila">
              <span>Mesa</span>
              <span>{pedidoFinal.mesa}</span>
            </div>
            <div className="procesando-resumen-fila">
              <span>Método de pago</span>
              <span>{pedidoFinal.metodoPago}</span>
            </div>
            <div className="procesando-resumen-fila">
              <span>Total</span>
              <span className="procesando-total">
                S/ {pedidoFinal.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="procesando-acciones">
            <button
              className="btn-secundario"
              onClick={() => navigate('/perfil')}
            >
              Ver mis pedidos
            </button>
            <button
              className="btn-primario"
              onClick={() => navigate('/menu')}
            >
              Volver al menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="procesando-wrapper">
      <div className="procesando-card">
        <div className="procesando-loader">
          <svg className="procesando-circulo" viewBox="0 0 44 44">
            <circle
              className="procesando-circulo-fondo"
              cx="22" cy="22" r="18"
              fill="none" strokeWidth="3"
            />
            <circle
              className="procesando-circulo-progreso"
              cx="22" cy="22" r="18"
              fill="none" strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - progreso / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="procesando-porcentaje">{progreso}%</span>
        </div>

        <h2 className="procesando-titulo">Procesando tu pedido</h2>

        <p className="procesando-mensaje">{mensaje}</p>

        <div className="procesando-barra-contenedor">
          <div
            className="procesando-barra-relleno"
            style={{ width: `${progreso}%` }}
          />
        </div>

        <div className="procesando-pasos">
          {PASOS.map((paso, i) => (
            <div
              key={i}
              className={`procesando-paso${i <= pasoActual ? ' activo' : ''}`}
            >
              <div className="procesando-paso-punto" />
              <span>{paso.mensaje}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}