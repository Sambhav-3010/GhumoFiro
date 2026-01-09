from flask import Flask
from config.settings import SERVER_HOST, SERVER_PORT
from database.mongodb import init_database
from routes.recommendations import recommendations_bp

def create_app():
    app = Flask(__name__)
    
    init_database()
    
    app.register_blueprint(recommendations_bp)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host=SERVER_HOST, port=SERVER_PORT, threaded=True)
