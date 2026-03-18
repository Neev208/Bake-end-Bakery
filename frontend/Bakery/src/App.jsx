import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Component Imports
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

// Page Imports
import Home from './Pages/Home';
import Login from './Pages/Login';
import Registration from './Pages/Registration';     
import Products from './Pages/Products';
import OurStory from './Pages/OurStory'; 
import ProductDetail from './Pages/ProductDetail';
import Contact from './Pages/Contact';
import Checkout from './Pages/Checkout';
import Success from './Pages/Success'; 

// Category Pages
import Bread from './Pages/Bread';
import Cakes from './Pages/Cakes';
import Pastries from './Pages/Pastries';
import Savoury from './Pages/Savoury';

// New Feature Imports
import CustomCakeBuilder from './Pages/CustomCakeBuilder'; 
import NewsletterPage from './Pages/NewsLetter'; 
import Cart from './Cart';         
import PartyPlanner from './PartyPlanner'; 
import CategoryPage from './Pages/CategoryPage';

// --- THE ACCOUNT & SECURITY IMPORTS ---
import AccountSettings from './Pages/AccountDetail';
import ForgotPassword from "./Pages/ForgotPassword"; 
import VerifyOTP from "./Pages/VerifyOTP";
import MyOrders from './Pages/MyOrders'; // <-- Added MyOrders Import

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#0A0A0A]">
        
        <Navbar />

        <main className="flex-grow relative">
          <Routes>
            {/* Core Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} /> 
            <Route path="/products" element={<Products/>} />
            <Route path="/contact"  element={<Contact/>} />
            <Route path="/story" element={<OurStory/>} />
            
            {/* Password Recovery Flow */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* Account Management */}
            <Route path="/account" element={<AccountSettings/>} />
            <Route path="/my-orders" element={<MyOrders />} /> {/* <-- Added MyOrders Route */}

            {/* Newsletter & Features */}
            <Route path="/newsletter" element={<NewsletterPage />} />
            <Route path="/custom-cake-builder" element={<CustomCakeBuilder />} />
            <Route path="/planner" element={<PartyPlanner/>} />

            {/* Dynamic Product & Category Routes */}
            <Route path="/product/:id" element={<ProductDetail/>} />
            <Route path="/category/:id" element={<CategoryPage/>} />

            {/* Static Category Routes */}
            <Route path="/bread-and-rolls" element={<Bread/>} />
            <Route path="/signature-cakes" element={<Cakes/>} />
            <Route path="/pastries-and-sweets" element={<Pastries/>} />
            <Route path="/savoury" element={<Savoury/>} />
            
            {/* Cart & Checkout Flow */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/order-success" element={<Success />} /> 
          </Routes>
        </main>

        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default App;