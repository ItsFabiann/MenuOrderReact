import './Contacto.css'

export default function Contacto() {
  return (
    <div className="contacto">
      <div className="contacto-header">
        <div className="contacto-header-inner">
          <h1>Contacto</h1>
          <p>Estamos disponibles para consultas</p>
        </div>
      </div>
      <div className="contacto-contenido">
        <div className="contacto-info">
          <h2>Información de contacto</h2>
          <div className="contacto-item">
            <div className="contacto-etiqueta">Correo electronico</div>
            <div className="contacto-valor">contacto@menuorder.com</div>
          </div>
          <div className="contacto-item">
            <div className="contacto-etiqueta">Telefono</div>
            <div className="contacto-valor">+51 987 654 321</div>
          </div>
          <div className="contacto-item">
            <div className="contacto-etiqueta">Dirección</div>
            <div className="contacto-valor">Av. Larco 123, Miraflores, Lima, Peru</div>
          </div>
          <div className="contacto-item">
            <div className="contacto-etiqueta">Horario de atención</div>
            <div className="contacto-valor">Lunes a Domingo — 12:00 pm a 10:00 pm</div>
          </div>
        </div>
      </div>
    </div>
  )
}