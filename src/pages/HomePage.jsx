import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import Tools from '../components/sections/Tools';
import CallToAction from '../components/sections/CallToAction';
import Footer from '../components/layout/Footer';
import useDocumentTitle from '../hooks/useDocumentTitle';

const HomePage = () => {
  useDocumentTitle('Home');

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Features />
        <Tools />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
