import CTASection from '../components/landing/CTASection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HeroSection from '../components/landing/HeroSection'
import Navbar from '../components/landing/Navbar'

const LandingPage = () => {
  return (
    <div>
        <Navbar/>
        <HeroSection/>
        <FeaturesSection/>
        <CTASection/>
    </div>
  )
}

export default LandingPage