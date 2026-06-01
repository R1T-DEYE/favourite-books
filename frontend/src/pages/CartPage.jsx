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

  useEffect(() => { fetchCart(); }, []);

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
    if (newQty <= 0) { handleRemove(bookId); return; }
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
    <div className="page-container">
      <h2>Your Cart</h2>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {cart.items.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <button onClick={() => navigate("/catalogue")}>Browse Catalogue</button>
        </div>
      ) : (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.book_id}>
                  <td>{item.title}</td>
                  <td>
                    <div className="qty-controls">
                      <button onClick={() => handleQuantityChange(item.book_id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.book_id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td>${item.unit_price.toFixed(2)}</td>
                  <td>${item.subtotal.toFixed(2)}</td>
                  <td><button onClick={() => handleRemove(item.book_id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-total">
            <h3>Total: ${cart.total.toFixed(2)}</h3>
          </div>

          <div className="button-group">
            <button onClick={() => navigate("/catalogue")}>Continue Shopping</button>
            <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}