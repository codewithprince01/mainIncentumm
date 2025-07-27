import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './FooterSection'

export default function Layout() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    // Force scroll to absolute top with multiple methods for reliability
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ 
      top: 0, 
      left: 0,
      behavior: 'smooth' 
    });
    
    // Fallback method
    setTimeout(() => {
      if (window.pageYOffset > 0) {
        window.scrollTo(0, 0);
      }
    }, 100);
  };

  return (
    <div>
      <Header/>
      <main className="pt-20">
        <Outlet/>
      </main>
      <Footer/>
      
      {/* Global Back to Top Button - Available on all pages */}
      {showScrollTop && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={scrollToTop}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-300 hover:rotate-12"
            aria-label="Back to top"
            title="Back to top"
          >
            <svg 
              className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
