# 💳 NeoWallet – Secure Digital Wallet Simulation

A full-stack Digital Wallet API built with **FastAPI** + **SQLite** (upgradeable to PostgreSQL).

---

## 🚀 Quick Setup (3 Steps)

### Step 1 – Install Dependencies
Open terminal inside the `NeoWallet` folder and run:
```bash
pip install -r requirements.txt
```

### Step 2 – Run the Server
```bash
python run.py
```

### Step 3 – Open in Browser
- API Home: http://127.0.0.1:8000
- **Interactive Docs (Swagger UI): http://127.0.0.1:8000/docs** ← Use this to test everything!

---

## 📂 Folder Structure
```
NeoWallet/
 ├── app/
 │    ├── main.py              # App entry, routes registered here
 │    ├── database.py          # DB connection & session
 │    ├── models.py            # Database tables (User, Transaction, FraudLog)
 │    ├── schemas.py           # Request/Response data shapes
 │    ├── auth.py              # JWT token logic, password hashing
 │    ├── routes/
 │    │    ├── auth_routes.py        # /auth/register, /auth/login
 │    │    ├── wallet_routes.py      # /wallet/balance, /wallet/deposit, /wallet/transfer
 │    │    └── transaction_routes.py # /transactions/, /transactions/summary
 │    └── utils/
 │         └── fraud_detection.py   # Fraud rules engine
 ├── run.py                    # Start server from here
 ├── requirements.txt
 ├── .env                      # Secret key & DB config
 └── neowallet.db              # SQLite DB (auto-created on first run)
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Create new account |
| POST | /auth/login | Login & get JWT token |

### Wallet
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /wallet/balance | Check your balance |
| POST | /wallet/deposit | Add money to wallet |
| POST | /wallet/transfer | Send money to another user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /transactions/ | View all transactions |
| GET | /transactions/summary | View totals & stats |

---

## 🚨 Fraud Detection Rules
The system automatically blocks transactions if:
1. More than **3 transfers in 1 minute**
2. Transfer amount exceeds **50% of wallet balance**
3. **5+ transfers** to same receiver in a day
4. Amount is **greater than ₹10,000**

---

## 🧪 How to Test (Using /docs)

1. Go to http://127.0.0.1:8000/docs
2. Register a user via `/auth/register`
3. Login via `/auth/login` — copy the `access_token`
4. Click **Authorize** button (top right) → paste the token
5. Now test deposit, transfer, transactions!
