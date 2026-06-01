# routes/staff.py
from fastapi import APIRouter, HTTPException
from services.report_service import generate_sales_report

router = APIRouter(prefix="/staff", tags=["staff"])

@router.get("/report")
def sales_report(date_from: str, date_to: str):
    try:
        return generate_sales_report(date_from, date_to)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))