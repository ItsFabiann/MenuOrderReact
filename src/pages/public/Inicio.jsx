import { Link } from 'react-router-dom'
import './Inicio.css'

export default function Inicio() {
  return (
    <div className="inicio">

      {/* Hero */}
      <section className="hero">
        <div className="hero-contenido">
          <div className="hero-etiqueta">Sistema de pedidos digitales</div>
          <h1 className="hero-titulo">
            El menú de tu restaurante<br />en manos de tus clientes
          </h1>
          <p className="hero-descripcion">
            MenuOrder digitaliza la toma de pedidos. El cliente elige desde su telefono,
            el restaurante recibe la orden en tiempo real. Sin errores, sin esperas innecesarias.
          </p>
          <div className="hero-acciones">
            <Link to="/menu" className="btn-primario">Ver el menú</Link>
            <Link to="/sobre-nosotros" className="btn-secundario">Conocer más</Link>
          </div>
        </div>
        <div className="hero-imagen">
          <div className="hero-mockup">
            <div className="mockup-barra" />
            <div className="mockup-contenido">
              <div className="mockup-linea ancho-80" />
              <div className="mockup-linea ancho-60" />
              <div className="mockup-grid">
                <div className="mockup-card" />
                <div className="mockup-card" />
                <div className="mockup-card" />
                <div className="mockup-card" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="como-funciona">
        <div className="seccion-inner">
          <h2 className="seccion-titulo">Como funciona</h2>
          <p className="seccion-subtitulo">Tres pasos para digitalizar tu atención</p>
          <div className="pasos">
            {[
              { num: '01', titulo: 'El cliente ingresa', desc: 'Se registra con su nombre y correo. La app guarda su cuenta de forma segura.' },
              { num: '02', titulo: 'Elige su pedido', desc: 'Navega el menú por categorias, ve el detalle de cada plato y agrega lo que desea.' },
              { num: '03', titulo: 'Paga y recibe su codigo', desc: 'Confirma el pago desde la app y recibe un código único para recoger su pedido.' },
            ].map(({ num, titulo, desc }) => (
              <div key={num} className="paso">
                <div className="paso-numero">{num}</div>
                <h3 className="paso-titulo">{titulo}</h3>
                <p className="paso-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="caracteristicas">
        <div className="seccion-inner">
          <h2 className="seccion-titulo">Por qué MenuOrder</h2>
          <p className="seccion-subtitulo">Beneficios reales para el restaurante y el cliente</p>
          <div className="caracteristicas-grid">
            {[
              { titulo: 'Sin errores en los pedidos', desc: 'El cliente escribe su propio pedido. No hay malentendidos entre el mozo y la cocina.' },
              { titulo: 'Menor tiempo de espera', desc: 'El pedido llega a cocina al instante. No hay que esperar que el mozo este disponible.' },
              { titulo: 'Historial del cliente', desc: 'Cada cliente puede ver sus pedidos anteriores con detalle, monto y estado.' },
              { titulo: 'Panel de administracion', desc: 'El restaurante gestiona platos, pedidos y clientes desde una web en tiempo real.' },
              { titulo: 'Pago desde la app', desc: 'Soporte para efectivo, tarjeta y Yape. El cliente paga sin necesitar al mozo.' },
              { titulo: 'Codigo de seguimiento', desc: 'Cada pedido genera un codigo unico tipo MO-XXXX para identificar la orden.' },
            ].map(({ titulo, desc }) => (
              <div key={titulo} className="caracteristica-card">
                <div className="caracteristica-punto" />
                <div>
                  <h3>{titulo}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-inner">
          <h2>Descubre nuestro menú</h2>
          <p>Explora los platos disponibles y conoce los precios antes de visitar el restaurante.</p>
          <Link to="/menu" className="btn-primario">Ver menú completo</Link>
        </div>
      </section>

    </div>
  )
}