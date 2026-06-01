// pages/CheckoutPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCart, checkout } from "../api/client";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cart, setCart] = useState({ items: [], total: 0 });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await getCart(user.linked_id);
        if (res.data.items.length === 0) {
          navigate("/cart");
          return;
        }
        setCart(res.data);
      } catch {
        setError("Failed to load cart.");
      }
    };
    loadCart();
  }, []);

  const handleCheckout = async () => {
    setError("");
    if (!shippingAddress.trim()) {
      setError("Shipping address is required.");
      return;
    }
    try {
      const res = await checkout({
        customer_id: user.linked_id,
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
      });
      if (res.data.success) {
        setReceipt(res.data);
      } else {
        setError("Payment was rejected. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Checkout failed.");
    }
  };

  if (receipt) {
    return (
      <div className="page-container">
        <h2>Order Confirmed!</h2>
        <p className="success">Your payment was approved and your order has been placed.</p>

        <div className="receipt-box">
          <h3>Receipt</h3>
          <p><strong>Receipt ID:</strong> {receipt.receipt.receipt_id}</p>
          <p><strong>Order ID:</strong> {receipt.order.order_id}</p>
          <p><strong>Total Paid:</strong> ${receipt.receipt.total.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> {receipt.payment.method}</p>
          <p><strong>Transaction Ref:</strong> {receipt.payment.transaction_ref}</p>
          <p><strong>Issued At:</strong> {new Date(receipt.receipt.issued_at).toLocaleString()}</p>
        </div>

        <div className="receipt-box">
          <h3>Shipment</h3>
          <p><strong>Shipment ID:</strong> {receipt.shipment.shipment_id}</p>
          <p><strong>Delivering to:</strong> {receipt.shipment.address}</p>
          <p><strong>Status:</strong> {receipt.shipment.status}</p>
        </div>

        <div className="button-group">
          <button onClick={() => navigate("/catalogue")}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>Checkout</h2>

      <h3>Order Summary</h3>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Qty</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.book_id}>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>${item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="cart-total">
        <h3>Total: ${cart.total.toFixed(2)}</h3>
      </div>

      <h3>Shipping Address</h3>
      <input
        className="full-width-input"
        placeholder="Enter your full shipping address"
        value={shippingAddress}
        onChange={(e) => setShippingAddress(e.target.value)}
      />

      <h3>Payment Method</h3>
      <div className="radio-group">
        <label>
          <input type="radio" name="payment" value="card"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
          /> Credit / Debit Card
        </label>
        <label>
          <input type="radio" name="payment" value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={() => setPaymentMethod("paypal")}
          /> PayPal
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="button-group">
        <button onClick={() => navigate("/cart")}>Back to Cart</button>
        <button onClick={handleCheckout}>Place Order</button>
      </div>
    </div>
  );
}