import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
USERS_COLLECTION = os.getenv("USERS_COLLECTION")
TRIPS_COLLECTION = os.getenv("TRIPS_COLLECTION")

SERVER_HOST = os.getenv("SERVER_HOST")
SERVER_PORT = int(os.getenv("SERVER_PORT"))

FALLBACK_RECOMMENDATIONS = [
    "mumbai", "delhi", "bangalore", "chennai", "kolkata", "hyderabad", "pune",
    "jaipur", "ahmedabad", "surat", "lucknow", "kanpur", "nagpur", "indore",
    "thane", "bhopal", "visakhapatnam", "pimpri-chinchwad", "patna", "vadodara",
    "goa", "kerala", "rajasthan", "himachal pradesh", "uttarakhand",
    "paris", "london", "tokyo", "new york", "dubai", "singapore", "thailand",
    "bali", "maldives", "nepal", "bhutan", "sri lanka", "malaysia", "vietnam"
]
