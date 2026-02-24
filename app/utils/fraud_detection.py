from sqlalchemy.orm import Session
from app import models
from datetime import datetime, timedelta


def check_fraud(user: models.User, amount: float, receiver_id: str, db: Session):
    """
    Returns (is_fraud: bool, reason: str, risk_score: float)
    """
    now = datetime.utcnow()
    one_minute_ago = now - timedelta(minutes=1)

    # Rule 1: More than 3 transfers in the last 1 minute
    recent_transfers = db.query(models.Transaction).filter(
        models.Transaction.sender_id == user.id,
        models.Transaction.transaction_type == "transfer",
        models.Transaction.timestamp >= one_minute_ago
    ).count()

    if recent_transfers >= 3:
        return True, "More than 3 transfers within 1 minute", 90.0

    # Rule 2: Transfer amount > 50% of wallet balance
    if user.wallet_balance > 0 and amount > (user.wallet_balance * 0.5):
        return True, "Transfer amount exceeds 50% of wallet balance", 70.0

    # Rule 3: Repeated transfers to same receiver (more than 5 times today)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    repeated = db.query(models.Transaction).filter(
        models.Transaction.sender_id == user.id,
        models.Transaction.receiver_id == receiver_id,
        models.Transaction.timestamp >= today_start
    ).count()

    if repeated >= 5:
        return True, "Repeated transfers to same receiver today", 60.0

    # Rule 4: Unusually large transaction (> 10000)
    if amount > 10000:
        return True, "Unusually large transaction amount", 80.0

    return False, "", 0.0


def log_fraud(user_id: str, reason: str, risk_score: float, db: Session):
    fraud_log = models.FraudLog(
        user_id=user_id,
        reason=reason,
        risk_score=risk_score
    )
    db.add(fraud_log)
    db.commit()
