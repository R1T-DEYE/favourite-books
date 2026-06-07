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
  const [sortOption, setSortOption] = useState("newest");
  const [priceFilter, setPriceFilter] = useState("all");

  const fetchBooks = async (query = "") => {
    try {
      const res = await getCatalogue(query);
      setBooks(res.data);

      const initial = {};
      res.data.forEach((b) => {
        initial[b.book_id] = 1;
      });
      setQuantities(initial);
    } catch {
      setError("Failed to load catalogue.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = () => {
    fetchBooks(search);
  };

  const handleQuantityChange = (bookId, value, maxStock) => {
    const qty = Math.max(1, Math.min(parseInt(value) || 1, maxStock));
    setQuantities({ ...quantities, [bookId]: qty });
  };

  const handleAddToCart = async (book) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const quantity = quantities[book.book_id] || 1;

    try {
      await addToCart({
        customer_id: user.linked_id,
        book_id: book.book_id,
        quantity,
      });

      setMessage(`"${book.title}" (x${quantity}) added to cart.`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not add to cart.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const displayedBooks = [...books]
    .filter((book) => {
      if (priceFilter === "under20") return book.price < 20;
      if (priceFilter === "20to30") return book.price >= 20 && book.price <= 30;
      if (priceFilter === "over30") return book.price > 30;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "price-low") return a.price - b.price;
      if (sortOption === "price-high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="catalogue-page">
      <header className="shop-header">
        <div className="shop-logo" onClick={() => navigate("/")}>
          FAVOURITE BOOKS
        </div>

        <nav className="shop-nav">
          <button onClick={() => navigate("/")}>HOME</button>
          <button onClick={() => fetchBooks()}>CATALOGUE</button>
          {user && <button onClick={() => navigate("/cart")}>CART</button>}
          {!user && <button onClick={() => navigate("/login")}>LOGIN</button>}
        </nav>
      </header>

      <div className="catalogue-layout">
        <aside className="filter-sidebar">
          <h3>FILTER</h3>

          <div className="filter-section">
            <h4>GENRE</h4>
            <p onClick={() => fetchBooks("fiction")}>Fiction</p>
            <p onClick={() => fetchBooks("science")}>Science Fiction</p>
            <p onClick={() => fetchBooks("dystopian")}>Dystopian</p>
            <p onClick={() => fetchBooks("non-fiction")}>Non-fiction</p>
            <p onClick={() => fetchBooks()}>All genres</p>
          </div>

          <div className="filter-section">
            <h4>PRICE</h4>
            <p onClick={() => setPriceFilter("under20")}>Under $20</p>
            <p onClick={() => setPriceFilter("20to30")}>$20 - $30</p>
            <p onClick={() => setPriceFilter("over30")}>$30+</p>
            <p onClick={() => setPriceFilter("all")}>All prices</p>
          </div>

          <div className="filter-section">
            <h4>ACCOUNT</h4>
            {user ? (
              <>
                <p>{user.email}</p>
                <p>{user.role}</p>
              </>
            ) : (
              <p onClick={() => navigate("/login")}>Login to buy</p>
            )}
          </div>
        </aside>

        <main className="product-area">
          <div className="product-toolbar">
            <div className="search-box">
              <input
                placeholder="Search title, author, genre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button onClick={handleSearch}>SEARCH</button>
              <button
                onClick={() => {
                  setSearch("");
                  setPriceFilter("all");
                  setSortOption("newest");
                  fetchBooks();
                }}
              >
                CLEAR
              </button>
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">NEWEST</option>
              <option value="price-low">PRICE LOW TO HIGH</option>
              <option value="price-high">PRICE HIGH TO LOW</option>
            </select>
          </div>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

          {displayedBooks.length === 0 ? (
            <p className="no-books">No books found.</p>
          ) : (
            <div className="product-grid">
              {displayedBooks.map((book) => (
                <div className="product-card" key={book.book_id}>
                  <div className="product-image">
                    <img
                      src={
                        book.image
                          ? `/books/${book.image}`
                          : "/books/placeholder.jpg"
                      }
                      alt={book.title}
                      className="book-image"
                      onError={(e) => {
                        e.currentTarget.src = "/books/placeholder.jpg";
                      }}
                    />

                    <button className="heart-btn">♡</button>
                  </div>

                  <div className="product-info">
                    <p className="book-author">{book.author}</p>
                    <h3>{book.title}</h3>
                    <p className="book-genre">{book.genre}</p>
                    <p className="book-price">${book.price.toFixed(2)}</p>
                    <p className="book-stock">
                      {book.stock > 0
                        ? `${book.stock} in stock`
                        : "Out of stock"}
                    </p>

                    {book.stock > 0 && user?.role === "customer" && (
                      <input
                        type="number"
                        min="1"
                        max={book.stock}
                        value={quantities[book.book_id] || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            book.book_id,
                            e.target.value,
                            book.stock
                          )
                        }
                        className="qty-input"
                      />
                    )}

                    {user?.role === "customer" && (
                      <button
                        className="buy-btn"
                        onClick={() => handleAddToCart(book)}
                        disabled={book.stock === 0}
                      >
                        {book.stock === 0 ? "NOTIFY ME" : "ADD TO CART"}
                      </button>
                    )}

                    {!user && (
                      <button
                        className="buy-btn"
                        onClick={() => navigate("/login")}
                      >
                        LOGIN TO BUY
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}