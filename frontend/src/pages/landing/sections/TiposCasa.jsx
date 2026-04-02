import IconIdosos from '../../../assets/idosos.svg'
import IconMental from '../../../assets/mental.svg'
import IconDependencia from '../../../assets/dependencia.svg'
import IconSocial from '../../../assets/social.svg'
import IconHospital from '../../../assets/hospital.svg'
import IconDeficiencia from '../../../assets/deficiencia.svg'
import IconTempo from '../../../assets/tempo.svg'
import IconPaliativo from '../../../assets/paliativo.svg'

const categorias = [
  {
    titulo: 'Idosos (Longa Permanência)',
    descricao: 'Casas especializadas no cuidado contínuo de idosos com suporte completo.',
    icon: IconIdosos
  },
  {
    titulo: 'Saúde Mental',
    descricao: 'Ambientes preparados para tratamento psicológico e emocional.',
    icon: IconMental
  },
  {
    titulo: 'Dependência Química',
    descricao: 'Recuperação com apoio médico e acompanhamento especializado.',
    icon: IconDependencia
  },
  {
    titulo: 'Vulnerabilidade Social',
    descricao: 'Acolhimento para pessoas em situação de risco social.',
    icon: IconSocial
  },
  {
    titulo: 'Cuidados Pós-Hospitalares',
    descricao: 'Recuperação assistida após procedimentos médicos.',
    icon: IconHospital
  },
  {
    titulo: 'Pessoas com Deficiência',
    descricao: 'Estrutura adaptada e cuidado especializado.',
    icon: IconDeficiencia
  },
  {
    titulo: 'Estadia Temporária',
    descricao: 'Hospedagem com cuidado por períodos curtos.',
    icon: IconTempo
  },
  {
    titulo: 'Cuidados Paliativos',
    descricao: 'Conforto e qualidade de vida em momentos delicados.',
    icon: IconPaliativo
  }
]

export default function TiposCasas() {
  return (
    <section style={{
      padding: '6rem 2rem',
      backgroundColor: 'var(--background)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'var(--text)',
            marginBottom: '0.8rem'
          }}>
            Conheça nossas categorias
          </h2>

          <p style={{
            color: 'var(--text)',
            opacity: 0.6
          }}>
            Encontre informação desejada pelas opções abaixo:
          </p>
        </div>

        {/* GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem'
        }}>

          {categorias.map((item, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                backgroundColor: 'var(--secondary)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'transform 0.2s',

                minHeight: '220px', // ✅ altura padrão
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center' // ✅ centralização total
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.querySelector('.overlay').style.opacity = 1
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.querySelector('.overlay').style.opacity = 0
              }}
            >

              {/* ÍCONE */}
              <img
                src={item.icon}
                alt={item.titulo}
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'contain',
                  marginBottom: '1rem'
                }}
              />

              {/* TÍTULO */}
              <div style={{
                fontWeight: '700',
                color: 'var(--text)',
                fontSize: '1rem',
                textAlign: 'center',
                maxWidth: '160px'
              }}>
                {item.titulo}
              </div>

              {/* OVERLAY */}
              <div
                className="overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'var(--primary-dark)',
                  color: 'var(--text-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '1.5rem',
                  fontSize: '0.9rem',
                  opacity: 0,
                  transition: 'opacity 0.25s'
                }}
              >
                {item.descricao}
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  )
}