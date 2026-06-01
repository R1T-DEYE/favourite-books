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
    getCart(user.linked_id)
      .then((res) => setCart(res.data))
      .catch(() => setError("Failed to load cart."));
  }, []);

  const handleCheckout = async () => {
    setError("");

    if (!shippingAddress.trim()) {
      setError("Shipping address is required.");
      return;
    }

    if (cart.items.length === 0) {
      setError("Your cart is empty.");
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

  // Show receipt after successful checkout
  if (receipt) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
        <h2>Order Confirmed!</h2>
        <p style={{ color: "green" }}>
          Your payment was approved and your order has been placed.
        </p>

        <div style={{ background: "#f9f9f9", padding: "20px", marginTop: "20px" }}>
          <h3>Receipt</h3>
          <p><strong>Receipt ID:</strong> {receipt.receipt.receipt_id}</p>
          <p><strong>Order ID:</strong> {receipt.order.order_id}</p>
          <p><strong>Total Paid:</strong> ${receipt.receipt.total.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> {receipt.payment.method}</p>
          <p><strong>Transaction Ref:</strong> {receipt.payment.transaction_ref}</p>
          <p><strong>Issued At:</strong> {new Date(receipt.receipt.issued_at).toLocaleString()}</p>
        </div>

        <div style={{ background: "#f0f0f0", padding: "20px", marginTop: "20px" }}>
          <h3>Shipment</h3>
          <p><strong>Shipment ID:</strong> {receipt.shipment.shipment_id}</p>
          <p><strong>Delivering to:</strong> {receipt.shipment.address}</p>
          <p><strong>Status:</strong> {receipt.shipment.status}</p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button onClick={() => navigate("/catalogue")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
      <h2>Checkout</h2>

      {/* Order Summary */}
      <h3>Order Summary</h3>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
              <th style={{ padding: "8px" }}>Title</th>
              <th style={{ padding: "8px" }}>Qty</th>
              <th style={{ padding: "8px" }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.book_id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>{item.title}</td>
                <td style={{ padding: "8px" }}>{item.quantity}</td>
                <td style={{ padding: "8px" }}>${item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ textAlign: "right" }}>Total: ${cart.total.toFixed(2)}</h3>

      {/* Shipping */}
      <h3>Shipping Address</h3>
      <input
        placeholder="Enter your full shipping address"
        value={shippingAddress}
        onChange={(e) => setShippingAddress(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
      />

      {/* Payment Method */}
      <h3>Payment Method</h3>
      <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
        <label>
          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
          />
          {" "}Credit / Debit Card
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={() => setPaymentMethod("paypal")}
          />
          {" "}PayPal
        </label>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/cart")}>Back to Cart</button>
        <button onClick={handleCheckout}>Place Order</button>
      </div>
    </div>
  );
}