import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home          from './pages/Home';
import Products      from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart          from './pages/Cart';
import Checkout      from './pages/Checkout';
import Orders        from './pages/Orders';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Profile       from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <style>{`
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
            body { background: #fefcf7; color: #1a1208; overflow-x: hidden; }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: #fefcf7; }
            ::-webkit-scrollbar-thumb { background: rgba(180,155,120,0.35); border-radius: 3px; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(193,127,58,0.5); }
            ::selection { background: rgba(193,127,58,0.2); color: #1a1208; }
          `}</style>

          <Navbar />

          <Routes>
            {/* Public */}
            <Route path="/"          element={<Home />} />
            <Route path="/products"  element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />

            {/* Auth required */}
            <Route path="/cart"     element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders"   element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin only */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
