# services/auth_service.py
import json
import hashlib
import uuid
import os
from models.account import Account
from models.customer import Customer

DATA_DIR = os.path.join(os.path.dirname(__file__), "../data")

def _load_json(filename: str) -> list:
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r") as f:
        return json.load(f)

def _save_json(filename: str, data: list):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def register_customer(first_name: str, last_name: str, email: str,
                      phone: str, address: str, password: str) -> dict:
    """
    Registers a new customer.
    Corresponds to Scenario 1 - Customer creates an account.
    Validates email uniqueness, creates Customer and Account objects,
    persists both to JSON storage.
    """
    accounts = _load_json("accounts.json")

    # Validate email is not already registered
    for acc in accounts:
        if acc["email"].lower() == email.lower():
            raise ValueError("An account with this email already exists.")

    customers = _load_json("customers.json")

    customer_id = f"cust_{uuid.uuid4().hex[:8]}"
    account_id = f"acc_{uuid.uuid4().hex[:8]}"

    customer = Customer(
        customer_id=customer_id,
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        address=address
    )

    account = Account(
        account_id=account_id,
        email=email,
        password_hash=_hash_password(password),
        role="customer",
        linked_id=customer_id
    )

    customers.append(customer.to_dict())
    accounts.append(account.to_dict())

    _save_json("customers.json", customers)
    _save_json("accounts.json", accounts)

    return {"message": "Registration successful.", "customer_id": customer_id}


def login(email: str, password: str) -> dict:
    """
    Authenticates a user by email and password.
    Returns role and linked_id so the frontend knows
    whether to redirect to customer or staff dashboard.
    """
    accounts = _load_json("accounts.json")
    password_hash = _hash_password(password)

    for acc in accounts:
        if acc["email"].lower() == email.lower():
            if acc["password_hash"] == password_hash:
                return {
                    "account_id": acc["account_id"],
                    "role": acc["role"],
                    "linked_id": acc["linked_id"],
                    "email": acc["email"]
                }
            else:
                raise ValueError("Incorrect password.")

    raise ValueError("No account found with that email.")