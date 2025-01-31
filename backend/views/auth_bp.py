from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, TokenBlocklist
from app import mail
from flask_mail import Message

auth_bp = Blueprint('auth_bp', __name__)

# User Registration (with encrypted password)
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Check if the user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "User with this email already exists. Please try with another email."}), 400

    # Encrypt password
    hashed_password = generate_password_hash(data['password'], method='sha256')

    # Create new user
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        role=data['role']
    )

    # Save to the database
    db.session.add(new_user)
    db.session.commit()

    # Send email confirmation
    try:
        send_welcome_email(new_user)
    except Exception as e:
        return jsonify({"message": f"User registered, but failed to send email. Error: {str(e)}"}), 500

    return jsonify({"message": "User registered successfully, confirmation email sent!"}), 201


def send_welcome_email(user):
    msg = Message(
        subject="Welcome to Real Estate Platform",
        recipients=[user.email],
        body=f"Hello {user.name},\n\nThank you for registering on our Real Estate Platform! We're excited to have you with us.\n\nBest regards,\nThe Team"
    )
    mail.send(msg)


# User/Admin Login (Password verification with hashed password)
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Find user by email
    user = User.query.filter_by(email=data['email']).first()

    if user and check_password_hash(user.password, data['password']):
        # Generate JWT token here with expiration
        access_token = create_access_token(identity=user.user_id)
        
        # Check if the user is an admin or a regular user and create dashboard URL
        dashboard_url = f"/dashboard/{user.role}"  # e.g. "/dashboard/admin" or "/dashboard/user"

        return jsonify({
            'access_token': access_token,
            'user': {
                'email': user.email,
                'role': user.role,  # Include role
                'name': user.name,   # Include name (if necessary)
                'dashboard_url': dashboard_url  # Include the dashboard URL
            },
            'message': 'Login successful'
        }), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401


# Get current user's info
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user:
        return jsonify({
            "message": f"User ID {user.user_id} profile fetched",
            "name": user.name,
            "email": user.email
        })
    else:
        return jsonify({"message": "User not found"}), 404


# Update user's profile
@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()

    # Update fields if provided in the request
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data and 'newPassword' in data:
        if check_password_hash(user.password, data['password']):
            user.password = generate_password_hash(data['newPassword'], method='sha256')
        else:
            return jsonify({"message": "Incorrect current password"}), 400

    # Save changes to the database
    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully",
        "name": user.name,
        "email": user.email
    })


# Logout (Blacklist the token)
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        # Get the current JWT token
        jti = get_jwt()['jti']  # Access the JTI of the current token

        # Add the token to the blocklist (mark it as invalid)
        token = TokenBlocklist(jti=jti)
        db.session.add(token)
        db.session.commit()

        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        return jsonify({"message": f"Error logging out: {str(e)}"}), 500
