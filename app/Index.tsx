"use client";

import AboutUsQuote from '@/components/Pages/Home/AboutUsQuote'
import Choose from '@/components/Pages/Home/Choose'
import Destinations from '@/components/Pages/Home/Destinations'
import Hero from '@/components/Pages/Home/Hero'
import ShowCase from '@/components/Pages/Home/ShowCase'
import PartnersCTA from '@/components/Pages/Home/PartnersCTA'
import YatraCTA from '@/components/Pages/Home/YatraCTA'
import Footor from '@/components/ui/Footor'
import Header from '@/components/ui/Header'
import HomeFilterSearch from '@/components/ui/HomeFilterSearch'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Index = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])
  return (
    <div className='relative bg-white font-sans w-full overflow-hidden' >
      <Header forceWhite={true} />
      <Hero />
      <AboutUsQuote />
      <Destinations />
      <Choose />
      <ShowCase />
      <section className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-[10px]">
        <PartnersCTA />
        <YatraCTA />
      </section>
      <Footor />
    </div>
  )
}

export default Index