"use client";

import AboutUsQuote from '@/components/Pages/Home/AboutUsQuote'
import Choose from '@/components/Pages/Home/Choose'
import Destinations from '@/components/Pages/Home/Destinations'
import Hero from '@/components/Pages/Home/Hero'
import ShowCase from '@/components/Pages/Home/ShowCase'
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
    <div className='relative bg-white font-sans' >
      <Header forceWhite={true} />
      <Hero />
      <AboutUsQuote />
      <Destinations />
      <Choose />
      <ShowCase />
      <Footor />
    </div>
  )
}

export default Index