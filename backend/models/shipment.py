# models/shipment.py
from dataclasses import dataclass
from typing import Literal

@dataclass
class Shipment:
    """
    Represents the delivery process for a confirmed order.
    Corresponds to the Shipment class in the A2 design.
    Created only after successful payment.
    """
    shipment_id: str
    order_id: str
    customer_id: str
    address: str
    status: Literal["preparing", "shipped", "delivered"] = "preparing"
    created_at: str = ""

    def to_dict(self) -> dict:
        return {
            "shipment_id": self.shipment_id,
            "order_id": self.order_id,
            "customer_id": self.customer_id,
            "address": self.address,
            "status": self.status,
            "created_at": self.created_at
        }

    @staticmethod
    def from_dict(data: dict) -> "Shipment":
        return Shipment(**data)