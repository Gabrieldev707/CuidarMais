import ImgPessoa from '../../../assets/pessoa.png'
import Img1 from '../../../assets/img4.png'
import Img2 from '../../../assets/img5.png'
import Logo from '../../../assets/logo.svg'
import IconDecor from '../../../assets/help.svg'

export default function HeroApresentacao() {
  return (
    <section style={{
      minHeight: '91.9vh',
      background: 'linear-gradient(135deg, #0C326F 0%, #11479D 79%, #165CCB 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      padding: '2rem'
    }}>

      {/* TEXTO GIGANTE FUNDO */}
      <div style={{
        position: 'absolute',
        top: '-19%',
        left: '13%',
        fontSize: 'clamp(11rem, 21vw, 18rem)',
        fontWeight: '900',
        color: 'white',
        opacity: 0.08,
        pointerEvents: 'none'
      }}>
        cuidado
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        alignItems: 'center',
        gap: '2rem'
      }}>

        {/* ESQUERDA (IMAGEM PESSOA) */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <img
            src={ImgPessoa}
            alt=""
            style={{
              width: '750px',
              height: '750px',
              maxWidth: '800px',
              position: 'absolute',
              left: '-100px',
              top: '-350px'
            }}
          />
        </div>

        {/* DIREITA */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'center'
        }}>

          {/* IMAGENS SUPERIORES */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <img
              src={Img1}
              style={{
                width: '250px',
                height: '161px',
                objectFit: 'cover'
              }}
            />

            <img
              src={Img2}
              style={{
                width: '250px',
                height: '161px',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* LOGO */}
          <div style={{
            display: 'flex',
            gap: '0.1rem'
          }}>
            <img src={Logo} style={{ width: '70px' }} />

            <h1 style={{
              fontSize: '5rem',
              fontWeight: '800'
            }}>
              <span style={{ color: 'var(--accent)' }}>Cuidar</span>
              <span style={{ color: 'var(--success)' }}>Mais</span>
            </h1>
          </div>

          {/* TEXTO */}
          <p style={{
            color: 'var(--text-light)',
            fontSize: '1.1rem',
            opacity: 0.9
          }}>
            + do que assistência: carinho, atenção e dignidade.
          </p>

        </div>
      </div>

      {/* DECORATIVO */}
      <div style={{
        position: 'absolute',
        bottom: '0px',
        right: '0px',
        opacity: 0.2
      }}>
        <img src={IconDecor} style={{ width: '200px' }} />
      </div>

    </section>
  )
}