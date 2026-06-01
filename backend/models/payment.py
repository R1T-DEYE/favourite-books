# models/payment.py
from dataclasses import dataclass
from typing import Literal, Optional

@dataclass
class Payment:
    """
    Records a payment transaction for an order.
    Corresponds to the Payment class in the A2 design.
    Delegates actual processing to a payment method (Strategy Pattern).
    """
    payment_id: str
    order_id: str
    amount: float
    method: Literal["card", "paypal"]
    status: Literal["approved", "rejected"] = "rejected"
    transaction_ref: Optional[str] = ""

    def to_dict(self) -> dict:
        return {
            "payment_id": self.payment_id,
            "order_id": self.order_id,
            "amount": self.amount,
            "method": self.method,
            "status": self.status,
            "transaction_ref": self.transaction_ref
        }

    @staticmethod
    def from_dict(data: dict) -> "Payment":
        return Payment(**data)


@dataclass
class InvoiceReceipt:
    """
    Proof of purchase generated after successful payment.
    Corresponds to the InvoiceReceipt class in the A2 design.
    """
    receipt_id: str
    order_id: str
    customer_id: str
    payment_id: str
    total: float
    issued_at: str

    def to_dict(self) -> dict:
        return {
            "receipt_id": self.receipt_id,
            "order_id": self.order_id,
            "customer_id": self.customer_id,
            "payment_id": self.payment_id,
            "total": self.total,
            "issued_at": self.issued_at
        }

    @staticmethod
    def from_dict(data: dict) -> "InvoiceReceipt":
        return InvoiceReceipt(**data)