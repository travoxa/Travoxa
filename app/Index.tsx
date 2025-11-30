import Hero from '@/components/Pages/Home/Hero'
import Header from '@/components/ui/Header'
import HomeFilterSearch from '@/components/ui/HomeFilterSearch'
import TopHeader from '@/components/ui/TopHeader'
import React from 'react'

const Index = () => {
  return (
    <div>
        <TopHeader />
        <Header />
        <Hero />
        <HomeFilterSearch />
    </div>
  )
}

export default Index