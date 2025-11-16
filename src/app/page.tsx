'use client'

import { useState } from 'react'
import Sidebar from '../components/sidebar'
import Hero from '../components/hero'
import Schedule from '../components/schedule'
import Carousel from '../components/carousel'
import Sponsors from '../components/sponsors'
import Footer from '../components/footer'

export default function Home() {
  const [activeNav, setActiveNav] = useState('home')

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      
      <main className="flex-1">
        <Hero />
        <Schedule />
        <Carousel />
        <Sponsors />
        <Footer />
      </main>
    </div>
  )
}

