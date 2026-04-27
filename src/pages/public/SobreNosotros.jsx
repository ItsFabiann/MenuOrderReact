import './SobreNosotros.css'

export default function SobreNosotros() {
  return (
    <div className="sobre-nosotros">

      <div className="sobre-header">
        <div className="sobre-header-inner">
          <h1>El restaurante</h1>
          <p>Cocina peruana autentica desde 1998</p>
        </div>
      </div>

      <div className="sobre-contenido">

        <section className="sobre-seccion">
          <div className="sobre-texto">
            <h2>Nuestra historia</h2>
            <p>
              MenuOrder Restaurante nacio en 1998 en el distrito de Miraflores, Lima,
              con una vision clara: llevar la cocina peruana tradicional a la mesa de
              todos, sin perder la esencia de los sabores de antano. Lo que comenzo
              como un pequeno local familiar se ha convertido en uno de los referentes
              de la gastronomia limena.
            </p>
            <p>
              Durante mas de dos decadas hemos mantenido el compromiso de usar
              ingredientes frescos seleccionados diariamente en el mercado, recetas
              heredadas de generacion en generacion y un servicio que hace sentir
              a cada cliente como en casa.
            </p>
          </div>
          <div className="sobre-datos">
            {[
              { numero: '1998', etiqueta: 'Ano de fundacion' },
              { numero: '26',   etiqueta: 'Anos de experiencia' },
              { numero: '40+',  etiqueta: 'Platos en el menu' },
              { numero: '200+', etiqueta: 'Clientes por dia' },
            ].map(({ numero, etiqueta }) => (
              <div key={etiqueta} className="dato-card">
                <div className="dato-numero">{numero}</div>
                <div className="dato-etiqueta">{etiqueta}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="sobre-valores">
          <h2>Nuestros valores</h2>
          <div className="valores-grid">
            {[
              { titulo: 'Calidad', desc: 'Ingredientes frescos seleccionados cada manana en el mercado de productores.' },
              { titulo: 'Tradicion', desc: 'Recetas autenticas de la cocina peruana, preservadas y perfeccionadas con el tiempo.' },
              { titulo: 'Servicio', desc: 'Cada cliente merece una experiencia memorable, desde que entra hasta que se va.' },
              { titulo: 'Innovacion', desc: 'Adoptamos tecnologia para mejorar tu experiencia sin perder el calor humano.' },
            ].map(({ titulo, desc }) => (
              <div key={titulo} className="valor-card">
                <div className="valor-titulo">{titulo}</div>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}