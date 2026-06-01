# services/cart_service.py
from models.cart import ShoppingCart, CartItem
from services.catalogue_service import get_book_by_id

# In-memory cart store - carts are session-based per A2 assumption A11
# Key: customer_id, Value: ShoppingCart
_carts: dict[str, ShoppingCart] = {}

def get_cart(customer_id: str) -> ShoppingCart:
    """Returns existing cart or creates a new one."""
    if customer_id not in _carts:
        _carts[customer_id] = ShoppingCart(customer_id=customer_id)
    return _carts[customer_id]

def add_to_cart(customer_id: str, book_id: str, quantity: int) -> dict:
    """
    Adds a book to the customer's cart after checking stock.
    Corresponds to Scenario 2 - stock check before adding.
    """
    if quantity <= 0:
        raise ValueError("Quantity must be at least 1.")

    book = get_book_by_id(book_id)

    if book["stock"] < quantity:
        raise ValueError(
            f"Not enough stock for '{book['title']}'. "
            f"Only {book['stock']} available."
        )

    cart = get_cart(customer_id)
    item = CartItem(
        book_id=book["book_id"],
        title=book["title"],
        quantity=quantity,
        unit_price=book["price"]
    )
    cart.add_item(item)
    return cart.to_dict()

def remove_from_cart(customer_id: str, book_id: str) -> dict:
    cart = get_cart(customer_id)
    cart.remove_item(book_id)
    return cart.to_dict()

def clear_cart(customer_id: str):
    if customer_id in _carts:
        _carts[customer_id].clear()

def get_cart_dict(customer_id: str) -> dict:
    return get_cart(customer_id).to_dict()