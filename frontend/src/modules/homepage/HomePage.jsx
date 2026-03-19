import React from 'react'
import Hero from './hero-section/Hero';
import Feature from './features/Feature';
import GetStarted from './get-started/GetStarted';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
const HomePage = () => {
  return (
    <>
    <Navbar/>
     <Hero/>
    <Feature/>
    <GetStarted/>
    <Footer/>
    </>
  )
}

export default HomePage;