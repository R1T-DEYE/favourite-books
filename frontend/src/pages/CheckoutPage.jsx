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

  // New states for payment details
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

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
    
    // 1. Validate Shipping Address
    if (!shippingAddress.trim()) {
      setError("Shipping address is required.");
      return;
    }

    // 2. Validate Payment Details based on selection
    if (paymentMethod === "card") {
      if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) {
        setError("All credit card details are required.");
        return;
      }
    } else if (paymentMethod === "paypal") {
      if (!paypalEmail.trim()) {
        setError("PayPal email address is required.");
        return;
      }
    }

    // 3. Construct extra payload details safely
    const paymentDetails = paymentMethod === "card" 
      ? { card_number: cardNumber, expiry: expiryDate, cvv: cvv }
      : { paypal_email: paypalEmail };

    try {
      const res = await checkout({
        customer_id: user.linked_id,
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        payment_details: paymentDetails, // Sending fields to backend
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
      <div className="form-group">
        <input
          className="full-width-input"
          placeholder="Enter your full shipping address"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
        />
      </div>

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

      {/* Dynamic Payment Fields conditional block */}
      {paymentMethod === "card" && (
        <div style={{ margin: "20px 0", padding: "15px", border: "1px solid #dee2e6", borderRadius: "8px" }}>
          <div className="form-group">
            <label>Card Number</label>
            <input 
              type="text" 
              placeholder="1234 5678 1234 5678" 
              value={cardNumber} 
              onChange={(e) => setCardNumber(e.target.value)} 
            />
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Expiry Date</label>
              <input 
                type="text" 
                placeholder="MM/YY" 
                value={expiryDate} 
                onChange={(e) => setExpiryDate(e.target.value)} 
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>CVV</label>
              <input 
                type="password" 
                placeholder="123" 
                value={cvv} 
                onChange={(e) => setCvv(e.target.value)} 
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div style={{ margin: "20px 0", padding: "15px", border: "1px solid #dee2e6", borderRadius: "8px" }}>
          <div className="form-group">
            <label>PayPal Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={paypalEmail} 
              onChange={(e) => setPaypalEmail(e.target.value)} 
            />
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <div className="button-group">
        <button className="secondary" onClick={() => navigate("/cart")}>Back to Cart</button>
        <button onClick={handleCheckout}>Place Order</button>
      </div>
    </div>
  );
}