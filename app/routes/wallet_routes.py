from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import get_current_user
from app.utils.fraud_detection import check_fraud, log_fraud
import uuid

router = APIRouter()


@router.get("/balance", response_model=schemas.BalanceResponse)
def get_balance(current_user: models.User = Depends(get_current_user)):
    return {
        "wallet_balance": current_user.wallet_balance,
        "full_name": current_user.full_name,
        "email": current_user.email
    }


@router.post("/deposit")
def deposit(
    data: schemas.DepositRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Deposit amount must be greater than 0")

    current_user.wallet_balance += data.amount

    txn = models.Transaction(
        id=str(uuid.uuid4()),
        receiver_id=current_user.id,
        amount=data.amount,
        transaction_type="deposit",
        status="success",
        description="Wallet deposit"
    )
    db.add(txn)
    db.commit()
    db.refresh(current_user)

    return {
        "message": f"₹{data.amount} deposited successfully",
        "new_balance": current_user.wallet_balance
    }


@router.post("/transfer")
def transfer(
    data: schemas.TransferRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Transfer amount must be greater than 0")

    # Find receiver
    receiver = db.query(models.User).filter(models.User.email == data.receiver_email).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    # Prevent self-transfer
    if receiver.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot transfer to yourself")

    # Check balance
    if current_user.wallet_balance < data.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    # Fraud check
    is_fraud, reason, risk_score = check_fraud(current_user, data.amount, receiver.id, db)
    if is_fraud:
        log_fraud(current_user.id, reason, risk_score, db)
        txn = models.Transaction(
            id=str(uuid.uuid4()),
            sender_id=current_user.id,
            receiver_id=receiver.id,
            amount=data.amount,
            transaction_type="transfer",
            status="flagged",
            description=f"FLAGGED: {reason}"
        )
        db.add(txn)
        db.commit()
        raise HTTPException(status_code=403, detail=f"Transaction flagged: {reason}")

    # Execute transfer
    current_user.wallet_balance -= data.amount
    receiver.wallet_balance += data.amount

    txn_sent = models.Transaction(
        id=str(uuid.uuid4()),
        sender_id=current_user.id,
        receiver_id=receiver.id,
        amount=data.amount,
        transaction_type="transfer",
        status="success",
        description=data.description or f"Transfer to {receiver.email}"
    )
    txn_received = models.Transaction(
        id=str(uuid.uuid4()),
        sender_id=current_user.id,
        receiver_id=receiver.id,
        amount=data.amount,
        transaction_type="received",
        status="success",
        description=data.description or f"Received from {current_user.email}"
    )

    db.add(txn_sent)
    db.add(txn_received)
    db.commit()

    return {
        "message": f"₹{data.amount} transferred to {receiver.full_name}",
        "new_balance": current_user.wallet_balance
    }
