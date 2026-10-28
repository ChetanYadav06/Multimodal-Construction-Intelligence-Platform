import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file
load_dotenv(dotenv_path=BASE_DIR / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))
UPLOAD_DIR = BASE_DIR / os.getenv("UPLOAD_DIR", "uploads")
DB_PATH = BASE_DIR / "construction_intelligence.db"

# Ensure upload directory exists
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

