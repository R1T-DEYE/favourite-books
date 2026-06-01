// pages/StaffDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getCatalogue,
  addBook,
  updateBook,
  deleteBook,
  getSalesReport,
} from "../api/client";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [books, setBooks] = useState([]);
  const [report, setReport] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("catalogue");

  const [newBook, setNewBook] = useState({
    title: "", author: "", genre: "",
    category: "", price: "", stock: "", description: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchBooks = async () => {
    try {
      const res = await getCatalogue();
      setBooks(res.data);
    } catch {
      setError("Failed to load catalogue.");
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleAddBook = async () => {
    setError("");
    if (!newBook.title || !newBook.author || !newBook.price || !newBook.stock) {
      setError("Title, author, price and stock are required.");
      return;
    }
    try {
      await addBook({
        ...newBook,
        price: parseFloat(newBook.price),
        stock: parseInt(newBook.stock),
      });
      setMessage("Book added successfully.");
      setNewBook({ title: "", author: "", genre: "", category: "", price: "", stock: "", description: "" });
      fetchBooks();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add book.");
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await deleteBook(bookId);
      setMessage("Book deleted.");
      fetchBooks();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete book.");
    }
  };

  const handleEditStart = (book) => {
    setEditingId(book.book_id);
    setEditForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      category: book.category,
      price: book.price,
      stock: book.stock,
      description: book.description,
    });
  };

  const handleEditSave = async (bookId) => {
    try {
      await updateBook(bookId, {
        ...editForm,
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock),
      });
      setMessage("Book updated.");
      setEditingId(null);
      fetchBooks();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update book.");
    }
  };

  const handleReport = async () => {
    setError("");
    if (!dateFrom || !dateTo) {
      setError("Both dates are required.");
      return;
    }
    try {
      const res = await getSalesReport(dateFrom, dateTo);
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate report.");
    }
  };

  return (
    <div className="page-container">

      <div className="staff-header">
        <h2>Staff Dashboard</h2>
        <div className="button-group">
          <span>Logged in as <strong>{user?.email}</strong></span>
          <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
        </div>
      </div>

      <div className="tab-group">
        <button
          className={activeTab === "catalogue" ? "tab-active" : ""}
          onClick={() => setActiveTab("catalogue")}
        >
          Manage Catalogue
        </button>
        <button
          className={activeTab === "add" ? "tab-active" : ""}
          onClick={() => setActiveTab("add")}
        >
          Add New Book
        </button>
        <button
          className={activeTab === "report" ? "tab-active" : ""}
          onClick={() => setActiveTab("report")}
        >
          Sales Report
        </button>
      </div>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {/* Tab: Manage Catalogue */}
      {activeTab === "catalogue" && (
        <div>
          <h3>Current Catalogue</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.book_id}>
                  {editingId === book.book_id ? (
                    <>
                      <td><input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></td>
                      <td><input value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} /></td>
                      <td><input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="qty-input" /></td>
                      <td><input type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} className="qty-input" /></td>
                      <td>
                        <div className="button-group">
                          <button onClick={() => handleEditSave(book.book_id)}>Save</button>
                          <button onClick={() => setEditingId(null)}>Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>${book.price.toFixed(2)}</td>
                      <td>{book.stock}</td>
                      <td>
                        <div className="button-group">
                          <button onClick={() => handleEditStart(book)}>Edit</button>
                          <button onClick={() => handleDelete(book.book_id)}>Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Add New Book */}
      {activeTab === "add" && (
        <div>
          <h3>Add New Book</h3>
          <div className="form-group">
            <input placeholder="Title *" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
            <input placeholder="Author *" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
            <input placeholder="Genre" value={newBook.genre} onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })} />
            <input placeholder="Category" value={newBook.category} onChange={(e) => setNewBook({ ...newBook, category: e.target.value })} />
            <input type="number" placeholder="Price *" value={newBook.price} onChange={(e) => setNewBook({ ...newBook, price: e.target.value })} />
            <input type="number" placeholder="Stock *" value={newBook.stock} onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })} />
            <input placeholder="Description" value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} />
            <button onClick={handleAddBook}>Add Book</button>
          </div>
        </div>
      )}

      {/* Tab: Sales Report */}
      {activeTab === "report" && (
        <div>
          <h3>Sales Report</h3>
          <div className="report-controls">
            <label>From: <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></label>
            <label>To: <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} /></label>
            <button onClick={handleReport}>Generate Report</button>
          </div>

          {report && (
            <div>
              <div className="receipt-box">
                <p><strong>Period:</strong> {report.date_from} to {report.date_to}</p>
                <p><strong>Total Orders:</strong> {report.total_orders}</p>
                <p><strong>Total Revenue:</strong> ${report.total_revenue.toFixed(2)}</p>
              </div>

              {report.items.length === 0 ? (
                <p>No sales data for this period.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Units Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.items.map((item) => (
                      <tr key={item.book_id}>
                        <td>{item.title}</td>
                        <td>{item.total_sold}</td>
                        <td>${item.total_revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}