# models/staff.py
from dataclasses import dataclass

@dataclass
class Staff:
    """
    Represents a bookstore employee.
    Corresponds to the Staff class in the A2 design.
    """
    staff_id: str
    first_name: str
    last_name: str
    email: str

    def to_dict(self) -> dict:
        return {
            "staff_id": self.staff_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email
        }

    @staticmethod
    def from_dict(data: dict) -> "Staff":
        return Staff(**data)