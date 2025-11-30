import AboutUsQuote from '@/components/Pages/Home/AboutUsQuote'
import Destinations from '@/components/Pages/Home/Destinations'
import Hero from '@/components/Pages/Home/Hero'
import Header from '@/components/ui/Header'
import HomeFilterSearch from '@/components/ui/HomeFilterSearch'

const Index = () => {
  return (
    <div className='relative' >
        <div className='fixed top-0' >
          <Header />
        </div>
        <Hero />
        <HomeFilterSearch />
        <AboutUsQuote />
        <Destinations />
        <div className='mt-[50vh]'></div>
    </div>
  )
}

export default Index