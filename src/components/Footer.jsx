import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-marca">
          <div className="footer-logo">MenuOrder</div>
          <p>
            Restaurante peruano en el corazon de Miraflores.<br />
            Cocina tradicional con ingredientes frescos<br />
            seleccionados cada dia.
          </p>
        </div>

        <div className="footer-col">
          <div className="footer-titulo">Navegacion</div>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/sobre-nosotros">El restaurante</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-titulo">Contacto</div>
          <ul>
            <li>contacto@menuorder.com</li>
            <li>+51 987 654 321</li>
            <li>Av. Larco 123, Miraflores</li>
            <li>Lima, Peru</li>
            <li>Lun - Dom: 12:00 pm - 10:00 pm</li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-titulo">Equipo de desarrollo</div>
          <ul>
            <li>Rai Tello Pareja</li>
            <li>Xiomara Silverio Rejas</li>
            <li>Axel Estrada Morales</li>
            <li>Miguel Arteaga Jimenez</li>
          </ul>
          <div className="footer-cibertec">CIBERTEC 2026</div>
        </div>

      </div>
      <div className="footer-bottom">
        <span>2026 MenuOrder. Todos los derechos reservados.</span>
      </div>
    </footer>
  )
}