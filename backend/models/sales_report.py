# models/sales_report.py
from dataclasses import dataclass, field
from typing import List

@dataclass
class SalesReportItem:
    """Single line item in a sales report - one book's sales data."""
    book_id: str
    title: str
    total_sold: int
    total_revenue: float

    def to_dict(self) -> dict:
        return {
            "book_id": self.book_id,
            "title": self.title,
            "total_sold": self.total_sold,
            "total_revenue": self.total_revenue
        }


@dataclass
class SalesReport:
    """
    Sales information generated for staff review.
    Corresponds to the SalesReport class in the A2 design.
    Aggregates data from completed Orders and InvoiceReceipts.
    """
    date_from: str
    date_to: str
    total_orders: int
    total_revenue: float
    items: List[SalesReportItem] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "date_from": self.date_from,
            "date_to": self.date_to,
            "total_orders": self.total_orders,
            "total_revenue": self.total_revenue,
            "items": [i.to_dict() for i in self.items]
        }