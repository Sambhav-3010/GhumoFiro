import pandas as pd
from pymongo import MongoClient
from bson import ObjectId
from config.settings import MONGO_URI, DB_NAME, USERS_COLLECTION, TRIPS_COLLECTION

client = None
db = None
users_collection = None
trips_collection = None

def init_database():
    global client, db, users_collection, trips_collection
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.server_info()
        db = client[DB_NAME]
        users_collection = db[USERS_COLLECTION]
        trips_collection = db[TRIPS_COLLECTION]
        print("MongoDB connection successful.")
        return True
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return False

def get_db():
    return db

def get_users_collection():
    return users_collection

def get_trips_collection():
    return trips_collection

def fetch_and_clean_data(collection, id_fields, to_lowercase_fields=None):
    if to_lowercase_fields is None:
        to_lowercase_fields = []
    
    if db is None:
        return pd.DataFrame()
    
    try:
        data = list(collection.find({}))
        if not data:
            return pd.DataFrame()

        for doc in data:
            for field in id_fields:
                if field in doc:
                    doc[field] = str(doc[field]).strip().lower()
            for field in to_lowercase_fields:
                if field in doc and isinstance(doc[field], str):
                    doc[field] = doc[field].strip().lower()

        return pd.DataFrame(data)
    except Exception as e:
        print(f"Error fetching data from {collection.name}: {e}")
        return pd.DataFrame()

def fetch_users_df():
    return fetch_and_clean_data(users_collection, id_fields=['_id'], to_lowercase_fields=['city'])

def fetch_trips_df():
    return fetch_and_clean_data(trips_collection, id_fields=['_id', 'user_id'])

def get_user_by_id(user_oid_str):
    if users_collection is None:
        return None
    try:
        user = users_collection.find_one({"_id": ObjectId(user_oid_str)})
        if user:
            user['_id'] = str(user['_id'])
        return user
    except Exception as e:
        print(f"Error fetching user by ID {user_oid_str}: {e}")
        return None

def get_all_users():
    if users_collection is None:
        return []
    try:
        return list(users_collection.find({}))
    except Exception as e:
        print(f"Error fetching all users: {e}")
        return []
