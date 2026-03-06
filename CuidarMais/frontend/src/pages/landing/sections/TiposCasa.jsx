const tipos = [
  {
    tipo: 'idosos',
    cor: '#80a6c6',
    titulo: 'Casas para Idosos',
    missao: 'Envelhecer com dignidade é um direito, não um privilégio.',
    descricao: 'Acreditamos que os anos vividos merecem ser celebrados com cuidado, respeito e carinho. Nossas casas parceiras oferecem muito mais do que assistência — oferecem um lar onde cada história de vida é valorizada.',
    pontos: [
      'Cuidado médico e de enfermagem especializado',
      'Atividades recreativas e socialização',
      'Alimentação adequada e acompanhamento nutricional',
      'Equipe treinada para cuidado humanizado'
    ],
    imagem: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&q=80'
  },
  {
    tipo: 'dependentes_quimicos',
    cor: '#e8a87c',
    titulo: 'Dependência Química',
    missao: 'Recomeçar é possível. O primeiro passo é pedir ajuda.',
    descricao: 'A recuperação é uma jornada que ninguém deveria fazer sozinho. Nossas casas parceiras criam ambientes seguros, livres de julgamentos, onde cada pessoa encontra o suporte necessário para reconstruir sua vida.',
    pontos: [
      'Acompanhamento psicológico e psiquiátrico',
      'Grupos de apoio e terapia em comunidade',
      'Desintoxicação assistida com segurança médica',
      'Reinserção social e capacitação profissional'
    ],
    imagem: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=600&q=80'
  },
  {
    tipo: 'saude_mental',
    cor: '#9b8fc4',
    titulo: 'Saúde Mental',
    missao: 'Cuidar da mente é tão essencial quanto cuidar do corpo.',
    descricao: 'Transtornos mentais afetam milhões de pessoas e ainda carregam um estigma injusto. Nossas casas parceiras oferecem acolhimento especializado, tratamento contínuo e um ambiente que promove equilíbrio e bem-estar.',
    pontos: [
      'Acompanhamento psiquiátrico e psicológico',
      'Terapia ocupacional e oficinas terapêuticas',
      'Ambiente estruturado e seguro',
      'Suporte à família e rede de apoio'
    ],
    imagem: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&q=80'
  },
  {
    tipo: 'vulnerabilidade_social',
    cor: '#7ab894',
    titulo: 'Vulnerabilidade Social',
    missao: 'Toda pessoa merece um lugar seguro para chamar de lar.',
    descricao: 'A vulnerabilidade social não define quem uma pessoa é — ela define o que a sociedade ainda precisa melhorar. Nossas casas parceiras oferecem abrigo, escuta e as ferramentas necessárias para uma nova história começar.',
    pontos: [
      'Abrigo seguro e alimentação garantida',
      'Assistência social e orientação jurídica',
      'Apoio para regularização de documentos',
      'Capacitação profissional e reinserção no mercado'
    ],
    imagem: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80'
  }
]

export default function TiposCasa() {
  return (
    <section id="sobre" style={{
      padding: '6rem 2rem',
      backgroundColor: 'var(--background)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'var(--accent)',
            color: 'var(--text)',
            padding: '0.4rem 1rem',
            borderRadius: '100px',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            Nossa missão
          </div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'var(--text)',
            letterSpacing: '-0.5px',
            marginBottom: '1rem'
          }}>
            Cuidado para quem mais precisa
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text)',
            opacity: 0.6,
            maxWidth: '540px',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            O CuidarMais conecta pessoas a casas de apoio em quatro áreas essenciais para a dignidade humana
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem'
        }}>
          {tipos.map((item, index) => (
            <div
              key={item.tipo}
              style={{
                backgroundColor: 'var(--secondary)',
                borderRadius: '24px',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Imagem */}
              <div style={{
                height: '200px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src={item.imagem}
                  alt={item.titulo}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.85)'
                  }}
                />
                {/* Overlay gradiente */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to top, ${item.cor}99, transparent)`
                }} />

                {/* Badge tipo */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  backgroundColor: item.cor,
                  color: 'white',
                  padding: '0.3rem 0.9rem',
                  borderRadius: '100px',
                  fontSize: '0.78rem',
                  fontWeight: '700'
                }}>
                  {item.titulo}
                </div>
              </div>

              {/* Conteúdo */}
              <div style={{ padding: '1.75rem' }}>

                {/* Missão */}
                <p style={{
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  color: item.cor,
                  marginBottom: '0.75rem',
                  lineHeight: '1.4',
                  fontStyle: 'italic'
                }}>
                  "{item.missao}"
                </p>

                {/* Descrição */}
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text)',
                  opacity: 0.7,
                  lineHeight: '1.7',
                  marginBottom: '1.25rem'
                }}>
                  {item.descricao}
                </p>

                {/* Pontos */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {item.pontos.map(ponto => (
                    <div key={ponto} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      fontSize: '0.88rem',
                      color: 'var(--text)',
                      opacity: 0.8
                    }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: item.cor + '30',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '1px'
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={item.cor} strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      {ponto}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}