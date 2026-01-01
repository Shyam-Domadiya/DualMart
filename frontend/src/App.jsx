import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyerDashboard from "./pages/BuyerDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import ProductsPage from "./pages/Products";
import Analytics from "./pages/Analytics";
import SupplierProducts from "./pages/SupplierProducts";
import ProductForm from "./pages/ProductForm";
import SupplierOrders from "./pages/SupplierOrders";

import Navbar from "./components/Navbar";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/buyer"
              element={
                <ProtectedRoute role="buyer">
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/supplier"
              element={
                <ProtectedRoute role="supplier">
                  <SupplierDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/supplier/products" element={<ProtectedRoute role="supplier"><SupplierProducts /></ProtectedRoute>} />
            <Route path="/supplier/products/add" element={<ProtectedRoute role="supplier"><ProductForm /></ProtectedRoute>} />
            <Route path="/supplier/products/edit/:id" element={<ProtectedRoute role="supplier"><ProductForm /></ProtectedRoute>} />
            <Route path="/supplier/orders" element={<ProtectedRoute role="supplier"><SupplierOrders /></ProtectedRoute>} />

            <Route
              path="/cart"
              element={
                <ProtectedRoute role="buyer">
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute role="buyer">
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute role="buyer">
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute role="buyer">
                  <ProductsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute role="supplier">
                  <Analytics />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
