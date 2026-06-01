# models/account.py
from dataclasses import dataclass
from typing import Literal

@dataclass
class Account:
    """
    Represents a user login identity.
    Corresponds to the Account class in the A2 design.
    Stores credentials and role - separate from Customer/Staff identity.
    """
    account_id: str
    email: str
    password_hash: str
    role: Literal["customer", "staff"]
    linked_id: str  # customer_id or staff_id

    def to_dict(self) -> dict:
        return {
            "account_id": self.account_id,
            "email": self.email,
            "password_hash": self.password_hash,
            "role": self.role,
            "linked_id": self.linked_id
        }

    @staticmethod
    def from_dict(data: dict) -> "Account":
        return Account(**data)