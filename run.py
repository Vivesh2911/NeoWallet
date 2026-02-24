import uvicorn
from app.database import engine, Base
from app import models

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
