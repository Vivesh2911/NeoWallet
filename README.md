# 💳 NeoWallet — Secure Digital Wallet Simulation System

![NeoWallet Banner](https://img.shields.io/badge/NeoWallet-Fintech%20App-6366f1?style=for-the-badge&logo=bitcoin&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)

> A production-style full-stack Digital Wallet simulation platform built with **FastAPI** and **React** — simulating real-world fintech systems like Paytm and Google Pay.

---

## 🌟 Live Features

### 🔐 Authentication System
- User Registration & Login with **JWT tokens**
- **Bcrypt** password hashing
- Protected routes on both frontend and backend
- Auto token refresh and secure localStorage management

### 💰 Wallet Operations
- **Deposit Money** — add funds with quick amount buttons
- **Transfer Money** — send money to any registered user by email
- **Real-time Balance** — instantly updated after every transaction
- **Self-transfer prevention** and insufficient balance checks

### 🚨 Fraud Detection Engine
Automatically blocks suspicious transactions based on:
- More than **3 transfers within 1 minute**
- Transfer exceeds **50% of wallet balance**
- **5+ transfers** to the same receiver in a day
- Transaction amount **greater than ₹10,000**
- All flagged transactions are logged in FraudLogs table

### 📜 Transaction History
- View **all transactions** with pagination
- **Filter** by type — deposit, transfer, received
- Color-coded status badges (success, flagged, failed)
- Detailed timestamp and description for every entry

### 🧾 Transaction Receipt
- Auto-redirect to receipt page after every transaction
- Shows full details — amount, recipient, date, balance after
- **Print receipt** functionality
- Professional receipt design with NeoWallet branding

### 📊 Spending Analytics Dashboard
- **Pie chart** — visual breakdown of deposited vs sent vs received
- **Bar chart** — last 7 days transaction activity
- **Balance history graph** — running balance over time
- Most active day insight
- Transaction type breakdown cards
- Success rate and average transaction stats

### 👤 Profile Management
- View and **edit profile** — name, phone number
- **Change password** with current password verification
- Member since date and wallet balance display
- Email locked (cannot be changed for security)

### 🔔 Toast Notifications
- Beautiful slide-in notifications for all actions
- Green success toasts ✓ and red error toasts ✗
- Auto-dismiss after 3 seconds
- Replaces all boring inline error messages

---

## 🏗️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI (Python) | REST API framework |
| SQLAlchemy ORM | Database interaction |
| SQLite / PostgreSQL | Database |
| JWT (python-jose) | Authentication tokens |
| Bcrypt (passlib) | Password hashing |
| Pydantic | Data validation |
| Uvicorn | ASGI server |

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js | UI framework |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Recharts | Charts and graphs |
| React Hot Toast | Notifications |
| CSS-in-JS | Styling |

---

## 🗄️ Database Design

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| full_name | String | User's full name |
| email | String (Unique) | Login email |
| password_hash | String | Bcrypt hashed password |
| phone_number | String | Optional phone |
| wallet_balance | Float | Current balance |
| created_at | DateTime | Registration date |
| is_active | Boolean | Account status |

### Transactions Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| sender_id | FK → Users | Who sent |
| receiver_id | FK → Users | Who received |
| amount | Float | Transaction amount |
| transaction_type | String | deposit/transfer/received |
| status | String | success/failed/flagged |
| description | String | Optional note |
| timestamp | DateTime | When it happened |

### FraudLogs Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | FK → Users | Who triggered it |
| reason | String | Why it was flagged |
| risk_score | Float | Risk level 0-100 |
| timestamp | DateTime | When detected |

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new account |
| POST | `/auth/login` | Login and get JWT token |

### Wallet
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wallet/balance` | Get current balance |
| POST | `/wallet/deposit` | Add money to wallet |
| POST | `/wallet/transfer` | Send money to user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions/` | Get transaction history |
| GET | `/transactions/summary` | Get totals and stats |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/me` | Get profile info |
| PUT | `/user/me` | Update profile |
| PUT | `/user/me/password` | Change password |

---

## 📂 Project Structure

```
NeoWallet/
 ├── app/
 │    ├── main.py                  # App entry, CORS, routers
 │    ├── database.py              # DB connection & session
 │    ├── models.py                # SQLAlchemy table models
 │    ├── schemas.py               # Pydantic request/response schemas
 │    ├── auth.py                  # JWT logic, password hashing
 │    ├── routes/
 │    │    ├── auth_routes.py      # /auth endpoints
 │    │    ├── wallet_routes.py    # /wallet endpoints
 │    │    ├── transaction_routes.py # /transactions endpoints
 │    │    └── user_routes.py      # /user endpoints
 │    └── utils/
 │         └── fraud_detection.py  # Fraud rules engine
 ├── frontend/
 │    └── src/
 │         ├── App.js              # Routes and auth guards
 │         ├── context/
 │         │    └── AuthContext.js # Global auth state
 │         ├── utils/
 │         │    └── api.js         # Axios instance with token
 │         ├── components/
 │         │    └── Sidebar.js     # Navigation sidebar
 │         └── pages/
 │              ├── Login.js
 │              ├── Register.js
 │              ├── Dashboard.js
 │              ├── Deposit.js
 │              ├── Transfer.js
 │              ├── Transactions.js
 │              ├── Receipt.js
 │              ├── Analytics.js
 │              └── Profile.js
 ├── run.py                        # Start server + create DB tables
 ├── requirements.txt
 └── .env
```

---

## 🚀 Quick Setup

### 1. Clone the repository
```bash
git clone https://github.com/Vivesh2911/NeoWallet.git
cd NeoWallet
```

### 2. Setup Backend
```bash
pip3 install -r requirements.txt
python3 run.py
```

Backend runs at: `http://127.0.0.1:8000`
API Docs at: `http://127.0.0.1:8000/docs`

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🧪 Test the App

1. Open `http://localhost:3000`
2. Register a new account
3. Deposit some money
4. Register a second account in incognito window
5. Transfer money between accounts
6. Check Analytics page for charts
7. View Transaction Receipt after each transaction

---

## 🧠 Key Technical Concepts Demonstrated

- ✅ RESTful API design with FastAPI
- ✅ JWT authentication flow
- ✅ Bcrypt password hashing
- ✅ SQLAlchemy ORM with relationships
- ✅ Atomic database transactions
- ✅ Fraud detection rule engine
- ✅ React Context API for global state
- ✅ Protected routes (frontend + backend)
- ✅ Axios interceptors for auto token injection
- ✅ Recharts data visualization
- ✅ Responsive dashboard UI

---

## 💼 Resume Description

> Built a full-stack Digital Wallet Simulation (NeoWallet) using FastAPI and React with JWT authentication, bcrypt password security, atomic transaction management, and a fraud detection engine. Features include wallet operations, spending analytics with interactive charts, transaction receipts, profile management, and toast notifications — simulating a production-grade fintech system.

---

## 🔮 Upcoming Features
- [ ] Request Money between users
- [ ] Admin Panel with fraud log viewer
- [ ] Export transactions to CSV
- [ ] Email notifications
- [ ] OTP verification for large transfers
- [ ] Docker containerization
- [ ] Cloud deployment (Render + Vercel)

---

## 👨‍💻 Developer

**Vivesh Rajput**
- GitHub: [@Vivesh2911](https://github.com/Vivesh2911)

---

<p align="center">Built with 💜 using FastAPI + React</p>
