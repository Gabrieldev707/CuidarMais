import { Link } from 'react-router-dom'

// 👉 IMPORTS (ajusta o caminho se necessário)
import Img1 from '../../../assets/img1.png'
import Img2 from '../../../assets/img2.png'
import Img3 from '../../../assets/img3.png'
import Logo from '../../../assets/logo.svg'

export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'var(--background)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* FUNDO */}
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-80px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary)',
        opacity: 0.1
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        alignItems: 'center'
      }}>

        {/* TEXTO */}
        <div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            lineHeight: '1.1',
            color: 'var(--text)',
            marginBottom: '1.5rem'
          }}>
            Encontre o lar ideal para quem você
            <span style={{ color: 'var(--primary)' }}> ama</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text)',
            opacity: 0.7,
            marginBottom: '2rem'
          }}>
            O CuidarMais conecta famílias a espaços de acolhimento em Campina Grande,
            oferecendo cuidado para idosos, pessoas em reabilitação e quem precisa de apoio.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/" style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              padding: '0.9rem 1.8rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Buscar Casas
            </Link>

            <Link to="/cadastro" style={{
              border: '2px solid var(--primary)',
              color: 'var(--primary)',
              padding: '0.9rem 1.8rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Cadastrar Minha Casa
            </Link>
          </div>

          {/* STATS */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '2.5rem',
            flexWrap: 'wrap'
          }}>
            {[
              { numero: '47', label: 'Casas Cadastradas' },
              { numero: '1.2K', label: 'Famílias atendidas' },
              { numero: '4.8', label: 'Avaliação média' }
            ].map(stat => (
              <div key={stat.label}>
                <div style={{
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  color: 'var(--text)'
                }}>
                  {stat.numero}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  opacity: 0.6
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IMAGENS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          alignItems: 'center'
        }}>

          <img
            src={Img1}
            style={{
              width: '100%',
              objectFit: 'cover'
            }}
          />

          <img
            src={Img2}
            style={{
              width: '100%',
              objectFit: 'cover'
            }}
          />

          {/* LOGO CENTRAL */}
          <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <img
              src={Logo}
              style={{
                width: '120px',
                objectFit: 'contain'
              }}
            />
          </div>

            <img
              src={Img3}
              style={{
                width: '100%',
                objectFit: 'cover'
              }}
            />

        </div>

      </div>
    </section>
  )
}