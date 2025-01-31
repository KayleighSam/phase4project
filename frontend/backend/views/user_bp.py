from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mail import Message
from models import db, User
from datetime import timedelta
from app import mail  # Import the mail instance

user_bp = Blueprint('user_bp', __name__)

# Register a new user (with hashed password and welcome email)
@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Check if the user already exists by email
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify(message="User with this email already exists."), 400

    # Hash the password
    hashed_password = generate_password_hash(data['password'])

    # Create a new user with hashed password
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,  # Store the hashed password
        role=data['role']
    )

    # Add and commit the user to the database
    db.session.add(new_user)
    db.session.commit()

    # Send a welcome email
    try:
        msg = Message(
            subject="Welcome to Real Estate App!",
            sender="samson.wanjiru@student.moringaschool.com",
            recipients=[data['email']],
            body=f"Hello {data['name']},\n\nWelcome to our Real Estate App! We're glad to have you on board.\n\nBest regards,\nThe Real Estate Team"
        )
        mail.send(msg)
    except Exception as e:
        return jsonify(message="User registered, but failed to send email.", error=str(e)), 201

    return jsonify(message="User created successfully, and welcome email sent."), 201


# Login (JWT-based authentication with hashed password verification)
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Find the user by email
    user = User.query.filter_by(email=data['email']).first()

    # If user exists and the password matches
    if user and check_password_hash(user.password, data['password']):
        # Create JWT token with user id as identity
        access_token = create_access_token(identity=user.user_id)
        return jsonify(access_token=access_token), 200

    # If user does not exist or password does not match
    return jsonify(message="Invalid credentials"), 401


# Get user profile (requires authentication)
@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        return jsonify(
            user_id=user.user_id,
            name=user.name,
            email=user.email,
            role=user.role
        ), 200
    return jsonify(message="User not found"), 404
