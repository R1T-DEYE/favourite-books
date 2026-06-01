// pages/CartPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCart, removeFromCart, updateCartQuantity } from "../api/client";

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cart, setCart] = useState({ items: [], total: 0 });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchCart = async () => {
    try {
      const res = await getCart(user.linked_id);
      setCart(res.data);
    } catch {
      setError("Failed to load cart.");
    }
  };

  useEffect(() => {
    getCart(user.linked_id)
      .then((res) => {
        if (res.data.items.length === 0) {
          navigate("/cart");
        } else {
          setCart(res.data);
        }
      })
      .catch(() => setError("Failed to load cart."));
  }, []);

  const handleRemove = async (bookId) => {
    try {
      const res = await removeFromCart(user.linked_id, bookId);
      setCart(res.data);
      setMessage("Item removed.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not remove item.");
    }
  };

  const handleQuantityChange = async (bookId, newQty) => {
    if (newQty <= 0) {
      handleRemove(bookId);
      return;
    }
    try {
      const res = await updateCartQuantity({
        customer_id: user.linked_id,
        book_id: bookId,
        quantity: newQty,
      });
      setCart(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update quantity.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <h2>Your Cart</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {cart.items.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <button onClick={() => navigate("/catalogue")}>Browse Catalogue</button>
        </div>
      ) : (
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
                <th style={{ padding: "8px" }}>Title</th>
                <th style={{ padding: "8px" }}>Qty</th>
                <th style={{ padding: "8px" }}>Unit Price</th>
                <th style={{ padding: "8px" }}>Subtotal</th>
                <th style={{ padding: "8px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.book_id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px" }}>{item.title}</td>
                  <td style={{ padding: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button onClick={() => handleQuantityChange(item.book_id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.book_id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td style={{ padding: "8px" }}>${item.unit_price.toFixed(2)}</td>
                  <td style={{ padding: "8px" }}>${item.subtotal.toFixed(2)}</td>
                  <td style={{ padding: "8px" }}>
                    <button onClick={() => handleRemove(item.book_id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <h3>Total: ${cart.total.toFixed(2)}</h3>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={() => navigate("/catalogue")}>Continue Shopping</button>
            <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}