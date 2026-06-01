# services/report_service.py
import json
import os
from models.sales_report import SalesReport, SalesReportItem

DATA_DIR = os.path.join(os.path.dirname(__file__), "../data")

def _load_json(filename: str) -> list:
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r") as f:
        return json.load(f)

def generate_sales_report(date_from: str, date_to: str) -> dict:
    """
    Generates a sales report for a given date range.
    Corresponds to Scenario 4 - Staff views sales report.
    Aggregates data from completed Orders.
    """
    orders = _load_json("orders.json")

    paid_orders = [
        o for o in orders
        if o["status"] == "paid"
        and date_from <= o["created_at"][:10] <= date_to
    ]

    # Aggregate sales per book
    book_sales: dict[str, dict] = {}
    for order in paid_orders:
        for item in order["items"]:
            bid = item["book_id"]
            if bid not in book_sales:
                book_sales[bid] = {
                    "book_id": bid,
                    "title": item["title"],
                    "total_sold": 0,
                    "total_revenue": 0.0
                }
            book_sales[bid]["total_sold"] += item["quantity"]
            book_sales[bid]["total_revenue"] += item["subtotal"]

    total_revenue = sum(o["total"] for o in paid_orders)

    report = SalesReport(
        date_from=date_from,
        date_to=date_to,
        total_orders=len(paid_orders),
        total_revenue=total_revenue,
        items=[SalesReportItem(**v) for v in book_sales.values()]
    )

    return report.to_dict()