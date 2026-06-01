// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CataloguePage from "./pages/CataloguePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import StaffDashboard from "./pages/StaffDashboard";

function ProtectedRoute({ children, requireStaff = false, requireCustomer = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (requireStaff && user.role !== "staff") return <Navigate to="/" />;
  if (requireCustomer && user.role !== "customer") return <Navigate to="/staff" />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/catalogue" element={<CataloguePage />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute requireCustomer={true}>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute requireCustomer={true}>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute requireStaff={true}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}