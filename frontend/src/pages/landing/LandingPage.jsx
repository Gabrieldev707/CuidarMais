import Hero from './sections/Hero'
import ComoFunciona from './sections/ComoFunciona'
import CasasDestaque from './sections/CasasDestaque'
import TiposCasa from './sections/TiposCasa'
import MapaPreview from './sections/MapaPreview'
import CTA from './sections/CTA'
import Footer from '../../components/layout/footer'
import HeroApresentacao from './sections/HeroApresentacao'

export default function LandingPage() {
  return (
    <main>
      <HeroApresentacao />
      <Hero />
      <ComoFunciona />
      <CasasDestaque />
      <TiposCasa />
      <MapaPreview />
      <CTA />
      <Footer />
    </main>
  )
}