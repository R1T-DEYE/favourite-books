// pages/HomePage.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="page-container">
      <h1>Favourite Books</h1>
      <p>Welcome to the Favourite Books Online Bookstore.</p>

      {user ? (
        <div>
          <p>Logged in as <strong>{user.email}</strong> ({user.role})</p>
          <div className="button-group">
            <button onClick={() => navigate("/catalogue")}>Browse Catalogue</button>
            {user.role === "customer" && (
              <button onClick={() => navigate("/cart")}>My Cart</button>
            )}
            {user.role === "staff" && (
              <button onClick={() => navigate("/staff")}>Staff Dashboard</button>
            )}
            <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
          </div>
        </div>
      ) : (
        <div className="button-group">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
          <button onClick={() => navigate("/catalogue")}>Browse Catalogue</button>
        </div>
      )}
    </div>
  );
}