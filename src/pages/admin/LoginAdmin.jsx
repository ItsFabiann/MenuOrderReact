import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import api from '../../api/axios'
import './LoginAdmin.css'

export default function LoginAdmin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [cargando, setCargando] = useState(false)
  const { iniciarSesion }       = useAdmin()
  const navigate                = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const { data } = await api.post('/admins/login', { email, password })
      iniciarSesion({ nombre: data.nombre, email: data.email })
      navigate('/admin/pedidos')
    } catch {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-admin">
      <div className="login-admin-card">

        <Link to="/" className="login-admin-volver">
          &larr; Volver al inicio
        </Link>

        <div className="login-admin-logo">MenuOrder</div>
        <div className="login-admin-titulo">Panel de administracion</div>
        <p className="login-admin-subtitulo">
          Ingresa con tus credenciales de administrador
        </p>

        <form onSubmit={handleSubmit} className="login-admin-form">
          <div className="campo">
            <label>Correo electronico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@menuorder.com"
              required
            />
          </div>
          <div className="campo">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
            />
          </div>
          {error && <p className="error-texto">{error}</p>}
          <button
            type="submit"
            className="btn-primario login-admin-btn"
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}