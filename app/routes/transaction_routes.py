from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas
from app.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[schemas.TransactionOut])
def get_transactions(
    transaction_type: Optional[str] = Query(None, description="Filter by type: deposit/transfer/received"),
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Transaction).filter(
        (models.Transaction.sender_id == current_user.id) |
        (models.Transaction.receiver_id == current_user.id)
    )

    if transaction_type:
        query = query.filter(models.Transaction.transaction_type == transaction_type)

    transactions = query.order_by(models.Transaction.timestamp.desc()).offset(offset).limit(limit).all()
    return transactions


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    all_txns = db.query(models.Transaction).filter(
        (models.Transaction.sender_id == current_user.id) |
        (models.Transaction.receiver_id == current_user.id)
    ).all()

    total_deposited = sum(t.amount for t in all_txns if t.transaction_type == "deposit" and t.status == "success")
    total_sent = sum(t.amount for t in all_txns if t.transaction_type == "transfer" and t.status == "success" and t.sender_id == current_user.id)
    total_received = sum(t.amount for t in all_txns if t.transaction_type == "received" and t.status == "success" and t.receiver_id == current_user.id)

    return {
        "current_balance": current_user.wallet_balance,
        "total_deposited": total_deposited,
        "total_sent": total_sent,
        "total_received": total_received,
        "total_transactions": len(all_txns)
    }
