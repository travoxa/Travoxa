"use client";

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Eagerly load above-the-fold components
import Header from '@/components/ui/Header'
import Hero from '@/components/Pages/Home/Hero'
import AboutUsQuote from '@/components/Pages/Home/AboutUsQuote'

// Lazy load below-the-fold components
const Destinations = dynamic(() => import('@/components/Pages/Home/Destinations'), { ssr: false })
const Choose = dynamic(() => import('@/components/Pages/Home/Choose'), { ssr: false })
const ShowCase = dynamic(() => import('@/components/Pages/Home/ShowCase'), { ssr: false })
const PartnersCTA = dynamic(() => import('@/components/Pages/Home/PartnersCTA'), { ssr: false })
const YatraCTA = dynamic(() => import('@/components/Pages/Home/YatraCTA'), { ssr: false })
const Footer = dynamic(() => import('@/components/ui/Footer'), { ssr: false })
const Cta = dynamic(() => import('@/components/ui/cta'), { ssr: false })

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
      <Cta />
      <Footer />
    </div>
  )
}

export default Index