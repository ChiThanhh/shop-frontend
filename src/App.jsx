import React, { useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import Footer from './components/Footer'
import Aos from "aos";
import "aos/dist/aos.css";
import { LoadingProvider } from './context/loadingContext'
import LoadingOverlay from './utils/LoadingOverlay'
function App() {
  useEffect(() => {
    Aos.init({
      duration: 600,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <>
      <LoadingProvider>
        <div >
          <Header />
          <Home />
          <Footer />
        </div>
           <LoadingOverlay />
      </LoadingProvider>
    </>
  )
}

export default App
