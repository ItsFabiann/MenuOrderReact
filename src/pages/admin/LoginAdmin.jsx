import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import api from '../../api/axios'
import './LoginAdmin.css'

export default function LoginAdmin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { iniciarSesion } = useAdmin()
  const navigate = useNavigate()

  useEffect(() => {
    // Mostrar mensaje visible en móvil
    const msg = document.createElement('div')
    msg.style.cssText = 'position:fixed; top:20%; left:10%; right:10%; background:#4CAF50; color:white; padding:15px; border-radius:10px; z-index:99999; text-align:center; font-size:16px;'
    msg.innerHTML = '✅ Login Admin cargado correctamente!<br><small>Hash: ' + window.location.hash + '</small>'
    document.body.appendChild(msg)
    setTimeout(() => msg.remove(), 3000)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    
    const msg = document.createElement('div')
    msg.style.cssText = 'position:fixed; top:30%; left:10%; right:10%; background:#FF9800; color:white; padding:15px; border-radius:10px; z-index:99999; text-align:center;'
    msg.innerHTML = '🔄 Intentando login...'
    document.body.appendChild(msg)
    
    try {
      const { data } = await api.post('/admins/login', { email, password })
      iniciarSesion({ nombre: data.nombre, email: data.email })
      
      msg.innerHTML = '✅ Login exitoso! Redirigiendo...'
      msg.style.background = '#4CAF50'
      
      setTimeout(() => {
        window.location.href = '/#/admin/pedidos'
      }, 1000)
      
    } catch (error) {
      msg.innerHTML = '❌ Error: ' + (error.response?.data?.message || 'Credenciales incorrectas')
      msg.style.background = '#f44336'
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
      setTimeout(() => msg.remove(), 3000)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-admin">
      <div className="login-admin-card">
        <Link to="/" className="login-admin-volver">&larr; Volver al inicio</Link>
        <div className="login-admin-logo">MenuOrder</div>
        <div className="login-admin-titulo">Panel de administracion</div>
        <p className="login-admin-subtitulo">Ingresa con tus credenciales de administrador</p>

        <form onSubmit={handleSubmit} className="login-admin-form">
          <div className="campo">
            <label>Correo electronico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@menuorder.com" required />
          </div>
          <div className="campo">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contraseña" required />
          </div>
          {error && <p className="error-texto">{error}</p>}
          <button type="submit" className="btn-primario login-admin-btn" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}