import { useState, useEffect } from 'react'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import SubirImagen from '../../components/SubirImagen'
import './Platos.css'

const CATEGORIAS = [
  { id: 1, nombre: 'Entradas' },
  { id: 2, nombre: 'Fondos' },
  { id: 3, nombre: 'Bebidas' },
  { id: 4, nombre: 'Postres' },
]

const PLATO_VACIO = {
  nombre: '', descripcion: '', precio: '', categoriaId: 1, imagenUrl: ''
}

export default function Platos() {
  const [platos, setPlatos]       = useState([])
  const [cargando, setCargando]   = useState(true)
  const [modal, setModal]         = useState(false)
  const [editando, setEditando]   = useState(null)
  const [form, setForm]           = useState(PLATO_VACIO)
  const [guardando, setGuardando] = useState(false)
  const [error, setError]         = useState('')

  const cargar = async () => {
    try {
      const { data } = await api.get('/platos/todos')
      setPlatos(data)
    } catch {
      console.error('Error al cargar platos')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => {
    setEditando(null)
    setForm(PLATO_VACIO)
    setError('')
    setModal(true)
  }

  const abrirEditar = (plato) => {
    setEditando(plato)
    setForm({
      nombre:      plato.nombre,
      descripcion: plato.descripcion,
      precio:      plato.precio,
      categoriaId: plato.categoriaId,
      imagenUrl:   plato.imagenUrl || ''
    })
    setError('')
    setModal(true)
  }

  const cerrarModal = () => setModal(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleImagenSubida = (url) => {
    setForm(prev => ({ ...prev, imagenUrl: url }))
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.nombre.trim() || !form.descripcion.trim() || !form.precio) {
      setError('Completa todos los campos obligatorios')
      return
    }
    setGuardando(true)
    try {
      const payload = {
        nombre:      form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio:      parseFloat(form.precio),
        categoriaId: parseInt(form.categoriaId),
        imagenUrl:   form.imagenUrl || ''
      }
      if (editando) {
        await api.put(`/platos/${editando.id}`, payload)
      } else {
        await api.post('/platos', payload)
      }
      await cargar()
      cerrarModal()
    } catch {
      setError('No se pudo guardar el plato')
    } finally {
      setGuardando(false)
    }
  }

  const toggleActivo = async (plato) => {
    try {
      const endpoint = plato.activo
        ? `/platos/${plato.id}/desactivar`
        : `/platos/${plato.id}/activar`
      await api.put(endpoint)
      setPlatos(prev =>
        prev.map(p => p.id === plato.id ? { ...p, activo: !p.activo } : p)
      )
    } catch {
      alert('No se pudo cambiar el estado del plato')
    }
  }

  if (cargando) return <Spinner />

  return (
    <div className="platos-page">
      <div className="page-header">
        <div>
          <h1 className="page-titulo">Platos</h1>
          <p className="page-subtitulo">{platos.length} platos registrados</p>
        </div>
        <button className="btn-primario" onClick={abrirCrear}>Agregar plato</button>
      </div>

      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoria</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {platos.map(plato => (
              <tr key={plato.id}>
                <td>
                  {plato.imagenUrl
                    ? <img src={plato.imagenUrl} alt={plato.nombre} className="tabla-img" />
                    : <div className="tabla-img-placeholder" />
                  }
                </td>
                <td>
                  <div className="plato-nombre-tabla">{plato.nombre}</div>
                  <div className="plato-desc-tabla">
                    {plato.descripcion.slice(0, 55)}{plato.descripcion.length > 55 ? '...' : ''}
                  </div>
                </td>
                <td>{plato.categoria}</td>
                <td>S/ {plato.precio.toFixed(2)}</td>
                <td>
                  <span className={`badge ${plato.activo ? 'badge-activo' : 'badge-inactivo'}`}>
                    {plato.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="tabla-acciones">
                    <button className="btn-secundario btn-sm" onClick={() => abrirEditar(plato)}>
                      Editar
                    </button>
                    <button
                      className={`${plato.activo ? 'btn-peligro' : 'btn-exito'} btn-sm`}
                      onClick={() => toggleActivo(plato)}
                    >
                      {plato.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal modal-grande" onClick={e => e.stopPropagation()}>
            <h2 className="modal-titulo">
              {editando ? 'Editar plato' : 'Agregar plato'}
            </h2>
            <form onSubmit={handleGuardar} className="modal-form">
              <div className="modal-dos-col">
                <div className="modal-col-izq">
                  <div className="campo">
                    <label>Nombre *</label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Nombre del plato"
                    />
                  </div>
                  <div className="campo">
                    <label>Descripcion *</label>
                    <textarea
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Descripcion del plato"
                    />
                  </div>
                  <div className="modal-fila">
                    <div className="campo">
                      <label>Precio (S/) *</label>
                      <input
                        name="precio"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.precio}
                        onChange={handleChange}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="campo">
                      <label>Categoría *</label>
                      <select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
                        {CATEGORIAS.map(c => (
                          <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-col-der">
                  <SubirImagen
                    imagenUrl={form.imagenUrl}
                    onImagenSubida={handleImagenSubida}
                  />
                </div>
              </div>

              {error && <p className="error-texto">{error}</p>}

              <div className="modal-acciones">
                <button type="button" className="btn-secundario" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primario" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar plato'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}