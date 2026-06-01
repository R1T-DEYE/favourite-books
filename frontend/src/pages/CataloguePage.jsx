// pages/CataloguePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCatalogue, addToCart } from "../api/client";

export default function CataloguePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchBooks = async (query = "") => {
    try {
      const res = await getCatalogue(query);
      setBooks(res.data);
      const initial = {};
      res.data.forEach((b) => { initial[b.book_id] = 1; });
      setQuantities(initial);
    } catch {
      setError("Failed to load catalogue.");
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleSearch = () => fetchBooks(search);

  const handleQuantityChange = (bookId, value, maxStock) => {
    const qty = Math.max(1, Math.min(parseInt(value) || 1, maxStock));
    setQuantities({ ...quantities, [bookId]: qty });
  };

  const handleAddToCart = async (book) => {
    if (!user) { navigate("/login"); return; }
    const quantity = quantities[book.book_id] || 1;
    try {
      await addToCart({ customer_id: user.linked_id, book_id: book.book_id, quantity });
      setMessage(`"${book.title}" (x${quantity}) added to cart.`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not add to cart.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="page-container">
      <h2>Book Catalogue</h2>

      <div className="search-bar">
        <input
          placeholder="Search by title, author, genre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => { setSearch(""); fetchBooks(); }}>Clear</button>
        <button onClick={() => navigate("/")}>Home</button>
        {user && <button onClick={() => navigate("/cart")}>View Cart</button>}
      </div>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Qty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.book_id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>{book.stock}</td>
                <td>
                  {book.stock > 0 && user?.role === "customer" && (
                    <input
                      type="number"
                      min="1"
                      max={book.stock}
                      value={quantities[book.book_id] || 1}
                      onChange={(e) => handleQuantityChange(book.book_id, e.target.value, book.stock)}
                      className="qty-input"
                    />
                  )}
                </td>
                <td>
                  {user?.role === "customer" && (
                    <button onClick={() => handleAddToCart(book)} disabled={book.stock === 0}>
                      {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  )}
                  {!user && (
                    <button onClick={() => navigate("/login")}>Login to Buy</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}