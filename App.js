import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Product from './Product';
import Cart from './Cart';
import Checkout from './Checkout';
import Calculate from './Calculate';
import NewCalculate from './NewCalculate';
import Header from './Header';
import Footer from './Footer';


const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header>
        E commerce App
      </Header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/calculate" element={<Calculate />} />
          <Route path="/newCalculate" element={<NewCalculate />} />
        </Routes>
      </BrowserRouter>
      <Footer style={{ marginTop: 'auto' }}>
        <p>&copy; 2024 Ecommerce App</p>
        <p>Contact us: <a href="mailto:support@example.com">support@example.com</a></p>
      </Footer>
    </div>
  );
};
export default App;