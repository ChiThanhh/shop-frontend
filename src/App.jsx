import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

import Aos from "aos";
import "aos/dist/aos.css";
import { LoadingProvider } from './context/loadingContext';
import LoadingOverlay from './utils/LoadingOverlay';
import DetailProductPage from './pages/product/DetailProductPage';
import { ConfirmProvider } from './context/confirmContext';
import GoogleSuccess from './pages/GoogleSuccess';
import { CartProvider } from './context/cartContext';

function App() {
  useEffect(() => {
    Aos.init({
      duration: 600,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <CartProvider>
      <LoadingProvider>
        <ConfirmProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<DetailProductPage />} />
            <Route path="/auth/google/success" element={<GoogleSuccess />} />
          </Routes>
          <Footer />
          <LoadingOverlay />
        </ConfirmProvider>
      </LoadingProvider>
    </CartProvider>

  );
}

export default App;
