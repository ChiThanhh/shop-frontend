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
import CartProduct from './pages/CartProduct';
import Checkout from './pages/Checkout';
import MyOrder from './pages/MyOrder';
import OrderSuccess from './pages/OrderSuccess';
import OrderDetail from './pages/OrderDetail.jsx';
import Product from './pages/Product';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { WishlistProvider } from './context/WishlistContext';
import { ViewHistoryProvider } from './context/ViewHistoryContext';
import Wishlist from './pages/Wishlist';
import ViewHistory from './pages/ViewHistory';
import LiveChat from './components/LiveChat';
import Profile from './pages/Profile';

function App() {
  useEffect(() => {
    Aos.init({
      duration: 600,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <AuthProvider>
      <WishlistProvider>
        <ViewHistoryProvider>
          <CartProvider>
            <LoadingProvider>
              <ConfirmProvider>
                <Header />
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products/:id" element={<DetailProductPage />} />
                  <Route path="/auth/google/success" element={<GoogleSuccess />} />
                  <Route path="/cart" element={<CartProduct />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/my-order" element={<MyOrder />} />
                  <Route path="/my-order/:order_id" element={<OrderDetail />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/product-list" element={<Product />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/view-history" element={<ViewHistory />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
                <Footer />
                <LoadingOverlay />
                <LiveChat />
              </ConfirmProvider>
            </LoadingProvider>
          </CartProvider>
        </ViewHistoryProvider>
      </WishlistProvider>
    </AuthProvider>

  );
}

export default App;
