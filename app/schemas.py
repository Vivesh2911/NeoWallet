from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── Auth Schemas ──────────────────────────────────────────────
class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone_number: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    full_name: str
    email: str
    wallet_balance: float


# ── Wallet Schemas ────────────────────────────────────────────
class DepositRequest(BaseModel):
    amount: float


class TransferRequest(BaseModel):
    receiver_email: str
    amount: float
    description: Optional[str] = None


class BalanceResponse(BaseModel):
    wallet_balance: float
    full_name: str
    email: str


# ── Transaction Schemas ───────────────────────────────────────
class TransactionOut(BaseModel):
    id: str
    amount: float
    transaction_type: str
    status: str
    description: Optional[str]
    timestamp: datetime
    sender_id: Optional[str]
    receiver_id: Optional[str]

    class Config:
        from_attributes = True


# ── User Schema ───────────────────────────────────────────────
class UserOut(BaseModel):
    id: str
    full_name: str
    email: str
    phone_number: Optional[str]
    wallet_balance: float
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True
