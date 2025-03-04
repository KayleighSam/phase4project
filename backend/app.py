from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS  # Import CORS
from models import db, User, Property, Listing, TokenBlocklist, Booking
from datetime import timedelta
import os  # To access environment variables
from dotenv import load_dotenv  # For environment variable management

# Load environment variables from .env file
load_dotenv()

# Initialize the Flask app
app = Flask(__name__)

# Enable CORS for multiple origins & allow credentials
CORS(app, resources={r"/*": {
    "origins": ["http://localhost:3000", "http://localhost:3001"],  # Allow multiple frontend origins
    "supports_credentials": True,  # Enable credentials (cookies, authentication tokens)
}})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'postgresql://realestatedb_snzt_user:GCn0MssOcStVHllpDGaDErfSVOnQLTD6@dpg-cuftab5ds78s73fp10i0-a.oregon-postgres.render.com/realestatedb_snzt')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "your_default_secret_key")

# JWT configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)

# Mail configuration
app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER", 'smtp.gmail.com')
app.config["MAIL_PORT"] = os.getenv("MAIL_PORT", 587)
app.config["MAIL_USE_TLS"] = os.getenv("MAIL_USE_TLS", True)
app.config["MAIL_USE_SSL"] = os.getenv("MAIL_USE_SSL", False)
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME", "samson.wanjiru@student.moringaschool.com")  
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD", "awot isoc ibax nnjq")  
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_DEFAULT_SENDER", "samson.wanjiru@student.moringaschool.com") 

# Initialize extensions
db.init_app(app)  # Initialize the database
migrate = Migrate(app, db)
jwt = JWTManager(app)
mail = Mail(app)

# Import blueprints
from views.user_bp import user_bp
from views.property_bp import property_bp
from views.listing_bp import listing_bp
from views.auth_bp import auth_bp
from views.admin_bp import admin_bp

# Register blueprints
app.register_blueprint(user_bp)
app.register_blueprint(property_bp)
app.register_blueprint(listing_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp, url_prefix="/admin")

# Token Blocklist Handler (for JWT blacklisting)
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

# Handle OPTIONS method (preflight request)
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", request.headers.get("Origin", "*"))
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.add("Access-Control-Allow-Credentials", "true")  # Allow credentials
    return response

if __name__ == '__main__':
    app.run(debug=True)
