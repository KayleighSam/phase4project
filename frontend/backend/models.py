from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize the database
db = SQLAlchemy()

# User Model
class User(db.Model):
    __tablename__ = 'users'  # Explicit table name
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # buyer, renter, or admin

    # Relationship with Listing
    listings = db.relationship('Listing', backref='user', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.name}, Email: {self.email}>"

# Property Model
class Property(db.Model):
    __tablename__ = 'properties'  # Explicit table name
    property_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(100), nullable=False) 
    type = db.Column(db.String(10), nullable=False)  # 'buy' or 'rent'
    availability_status = db.Column(db.String(20), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)  # For storing image URL or path

    # Relationship with Listing
    listings = db.relationship('Listing', backref='property', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Property {self.title}, Location: {self.location}>"

# Listing Model
class Listing(db.Model):
    __tablename__ = 'listings'  # Explicit table name
    listing_id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.property_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    listing_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"<Listing {self.listing_id}, Status: {self.status}>"

# Token Blocklist Model (for JWT blacklisting)
class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist'  # Explicit table name
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)  # JWT ID (unique identifier)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # Timestamp of when the token was blacklisted

    def __repr__(self):
        return f"<TokenBlocklist {self.jti}>"
