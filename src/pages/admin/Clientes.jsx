import { useState, useEffect } from 'react'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import './Clientes.css'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  const cargar = async () => {
    try {
      const { data } = await api.get('/usuarios')
      setClientes(data)
    } catch {
      console.error('Error al cargar clientes')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const toggleActivo = async (cliente) => {
    try {
      const endpoint = cliente.activo
        ? `/usuarios/${cliente.id}/desactivar`
        : `/usuarios/${cliente.id}/activar`
      await api.put(endpoint)
      setClientes(prev =>
        prev.map(c => c.id === cliente.id ? { ...c, activo: !c.activo } : c)
      )
    } catch {
      alert('No se pudo cambiar el estado del cliente')
    }
  }

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (cargando) return <Spinner />

  return (
    <div className="clientes-page">
      <div className="page-header">
        <div>
          <h1 className="page-titulo">Clientes</h1>
          <p className="page-subtitulo">{clientes.length} cuentas registradas</p>
        </div>
      </div>

      <div className="clientes-buscador">
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="buscador-input"
        />
      </div>

      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(cliente => (
              <tr key={cliente.id}>
                <td><strong>{cliente.nombre}</strong></td>
                <td>{cliente.email}</td>
                <td>
                  <span className={`badge ${cliente.activo ? 'badge-activo' : 'badge-inactivo'}`}>
                    {cliente.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button
                    className={cliente.activo ? 'btn-peligro btn-sm' : 'btn-exito btn-sm'}
                    onClick={() => toggleActivo(cliente)}
                  >
                    {cliente.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}