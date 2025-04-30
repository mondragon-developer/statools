import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import Tools from '../components/sections/Tools';
import CallToAction from '../components/sections/CallToAction';
import Footer from '../components/layout/Footer';

const HomePage = () => {
  return (
    <div className="bg-platinum min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Tools />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default HomePage;
