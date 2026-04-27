import { useState } from 'react'
import './SubirImagen.css'

export default function SubirImagen({ imagenUrl, onImagenSubida }) {
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError]       = useState('')

  const handleArchivo = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!tiposPermitidos.includes(archivo.type)) {
      setError('Solo se permiten imagenes JPG, PNG o WebP')
      return
    }
    if (archivo.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5MB')
      return
    }

    setError('')
    setSubiendo(true)

    try {
      const formData = new FormData()
      formData.append('file',   archivo)
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      )
      const data = await res.json()

      if (data.secure_url) {
        onImagenSubida(data.secure_url)
      } else {
        setError('No se pudo subir la imagen')
      }
    } catch {
      setError('Error al subir la imagen')
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <div className="subir-imagen">
      <label className="subir-imagen-label">Imagen del plato</label>

      {imagenUrl && (
        <div className="subir-imagen-preview">
          <img src={imagenUrl} alt="Vista previa" />
        </div>
      )}

      <label className="subir-imagen-btn">
        {subiendo ? 'Subiendo imagen...' : imagenUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleArchivo}
          disabled={subiendo}
          style={{ display: 'none' }}
        />
      </label>

      {error && <p className="error-texto">{error}</p>}
      <p className="subir-imagen-hint">JPG, PNG o WebP. Maximo 5MB.</p>
    </div>
  )
}