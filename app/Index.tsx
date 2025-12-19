import AboutUsQuote from '@/components/Pages/Home/AboutUsQuote'
import Choose from '@/components/Pages/Home/Choose'
import Destinations from '@/components/Pages/Home/Destinations'
import Hero from '@/components/Pages/Home/Hero'
import ShowCase from '@/components/Pages/Home/ShowCase'
import Footor from '@/components/ui/Footor'
import Header from '@/components/ui/Header'
import HomeFilterSearch from '@/components/ui/HomeFilterSearch'

const Index = () => {
  return (
    <div className='relative' >
        <div className='fixed top-0 z-50' >
          <Header />
        </div>
        <Hero />
        <HomeFilterSearch />
        <AboutUsQuote />
        <Destinations />
        <Choose />
        <ShowCase />
        <Footor />
    </div>
  )
}

export default Index