import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://sambhav:t5uKgPk3xgeXcf7A@cluster0.s7uiifm.mongodb.net/")
DB_NAME = os.getenv("DB_NAME", "test")
USERS_COLLECTION = os.getenv("USERS_COLLECTION", "users")
TRIPS_COLLECTION = os.getenv("TRIPS_COLLECTION", "trips")

SERVER_HOST = os.getenv("SERVER_HOST", "0.0.0.0")
SERVER_PORT = int(os.getenv("SERVER_PORT", "5001"))

FALLBACK_RECOMMENDATIONS = [
    "mumbai", "delhi", "bangalore", "chennai", "kolkata", "hyderabad", "pune",
    "jaipur", "ahmedabad", "surat", "lucknow", "kanpur", "nagpur", "indore",
    "thane", "bhopal", "visakhapatnam", "pimpri-chinchwad", "patna", "vadodara",
    "goa", "kerala", "rajasthan", "himachal pradesh", "uttarakhand",
    "paris", "london", "tokyo", "new york", "dubai", "singapore", "thailand",
    "bali", "maldives", "nepal", "bhutan", "sri lanka", "malaysia", "vietnam"
]
