from flask import Flask
from flask_cors import CORS
from config.settings import SERVER_HOST, SERVER_PORT
from database.mongodb import init_database
from routes.recommendations import recommendations_bp
from dotenv import load_dotenv
import os
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, origins=[os.getenv("FRONTEND_URL")], supports_credentials=True)
    
    init_database()
    
    app.register_blueprint(recommendations_bp)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host=SERVER_HOST, port=SERVER_PORT, threaded=True)
