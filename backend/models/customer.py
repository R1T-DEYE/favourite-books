# models/customer.py
from dataclasses import dataclass

@dataclass
class Customer:
    """
    Represents a person who purchases books.
    Corresponds to the Customer class in the A2 design.
    Intentionally separate from Account - Customer is identity,
    Account is authentication.
    """
    customer_id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str

    def to_dict(self) -> dict:
        return {
            "customer_id": self.customer_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address
        }

    @staticmethod
    def from_dict(data: dict) -> "Customer":
        return Customer(**data)