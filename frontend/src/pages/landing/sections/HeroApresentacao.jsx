import ImgPessoa from '../../../assets/pessoa.png'
import Img1 from '../../../assets/img4.png'
import Img2 from '../../../assets/img5.png'
import Logo from '../../../assets/logo.svg'
import IconDecor from '../../../assets/help.svg'

export default function HeroApresentacao() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0C326F 0%, #11479D 79%, #165CCB 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '4rem 2rem 0',
    }}>

      {/* TEXTO GIGANTE FUNDO */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '5%',
        fontSize: 'clamp(6rem, 18vw, 16rem)',
        fontWeight: '900',
        color: 'white',
        opacity: 0.05,
        pointerEvents: 'none',
        userSelect: 'none',
        lineHeight: 1
      }}>
        cuidado
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        alignItems: 'flex-end',
        gap: '2rem'
      }}>

        {/* ESQUERDA — imagem da pessoa ancorada no fundo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}>
          <img
            src={ImgPessoa}
            alt=""
            style={{
              width: '100%',
              maxWidth: '400px',
              display: 'block',
              objectFit: 'contain',
              objectPosition: 'bottom'
            }}
          />
        </div>

        {/* DIREITA */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          paddingBottom: '3rem'
        }}>

          {/* IMAGENS SUPERIORES */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            width: '100%',
            justifyContent: 'center'
          }}>
            <img
              src={Img1}
              alt=""
              style={{
                flex: 1,
                minWidth: 0,
                maxWidth: '260px',
                height: '155px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            <img
              src={Img2}
              alt=""
              style={{
                flex: 1,
                minWidth: 0,
                maxWidth: '260px',
                height: '155px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* LOGO + TÍTULO */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <img src={Logo} alt="Logo" style={{ width: '60px', flexShrink: 0 }} />
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '800',
              lineHeight: 1
            }}>
              <span style={{ color: 'var(--accent)' }}>Cuidar</span>
              <span style={{ color: 'var(--success)' }}>Mais</span>
            </h1>
          </div>

          {/* TEXTO */}
          <p style={{
            color: 'var(--text-light)',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            opacity: 0.9,
            textAlign: 'center'
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
        opacity: 0.15,
        pointerEvents: 'none'
      }}>
        <img src={IconDecor} style={{ width: '180px' }} alt="" />
      </div>

    </section>
  )
}
