import React from 'react'
import Hero from '../Components/Hero'
import TopNiches from '../Components/TopNiches'
import HowItWorks from '../Components/HowItWorks'

const home = () => {
  return (
    <div class = "home">
      <Hero />
      <TopNiches />
      <HowItWorks />
    </div>
  )
}

export default home
