from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from app.routes import auth_routes, wallet_routes, transaction_routes
from app.routes import auth_routes, wallet_routes, transaction_routes, user_routes

app = FastAPI(
    title="NeoWallet API",
    description="Secure Digital Wallet Simulation System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(wallet_routes.router, prefix="/wallet", tags=["Wallet"])
app.include_router(transaction_routes.router, prefix="/transactions", tags=["Transactions"])
app.include_router(user_routes.router, prefix="/user", tags=["User"])

@app.get("/", tags=["Health"])
def home():
    return {"message": "Welcome to NeoWallet 💳", "status": "running", "docs": "/docs"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
