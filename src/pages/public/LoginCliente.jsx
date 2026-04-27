import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCliente } from '../../context/ClienteContext'
import api from '../../api/axios'
import './LoginCliente.css'

export default function LoginCliente() {
  const [modo, setModo]         = useState('login')
  const [nombre, setNombre]     = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [cargando, setCargando] = useState(false)
  const { iniciarSesion }       = useCliente()
  const navigate                = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      if (modo === 'login') {
        const { data } = await api.post('/usuarios/login', { email, password })
        iniciarSesion({ id: data.id, nombre: data.nombre, email: data.email })
        navigate('/menu')
      } else {
        if (!nombre.trim()) { setError('Ingresa tu nombre'); return }
        if (password.length < 6) { setError('Minimo 6 caracteres en la contraseña'); return }
        const { data } = await api.post('/usuarios/registro', { nombre, email, password })
        iniciarSesion({ id: data.id, nombre: data.nombre, email: data.email })
        navigate('/menu')
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Ocurrio un error. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-cliente">
      <div className="login-cliente-card">
        <Link to="/" className="login-cliente-logo">MenuOrder</Link>
        <h1 className="login-cliente-titulo">
          {modo === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta'}
        </h1>
        <p className="login-cliente-sub">
          {modo === 'login'
            ? 'Ingresa para ver tu historial y hacer pedidos'
            : 'Regístrate para comenzar a pedir'}
        </p>

        <div className="login-cliente-tabs">
          <button
            className={modo === 'login' ? 'tab-activo' : ''}
            onClick={() => { setModo('login'); setError('') }}
          >
            Iniciar sesion
          </button>
          <button
            className={modo === 'registro' ? 'tab-activo' : ''}
            onClick={() => { setModo('registro'); setError('') }}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-cliente-form">
          {modo === 'registro' && (
            <div className="campo">
              <label>Nombre completo</label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>
          )}
          <div className="campo">
            <label>Correo electronico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tucorreo@email.com"
              required
            />
          </div>
          <div className="campo">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimo 6 caracteres"
              required
            />
          </div>
          {error && <p className="error-texto">{error}</p>}
          <button type="submit" className="btn-primario login-cliente-btn" disabled={cargando}>
            {cargando
              ? 'Procesando...'
              : modo === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}