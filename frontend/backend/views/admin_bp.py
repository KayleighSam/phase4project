from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User

admin_bp = Blueprint('admin_bp', __name__)

# Register a new admin (requires an existing admin)
@admin_bp.route('/register', methods=['POST'])
@jwt_required()
def register_admin():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify(message="Access denied. Admins only."), 403

    data = request.get_json()
    existing_admin = User.query.filter_by(email=data['email']).first()
    if existing_admin:
        return jsonify(message="An admin with this email already exists."), 400

    hashed_password = generate_password_hash(data['password'])
    new_admin = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        role="admin"
    )

    db.session.add(new_admin)
    db.session.commit()

    return jsonify(message="Admin user created successfully"), 201

# Get all users (Admins only)
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify(message="Access denied. Admins only."), 403

    users = User.query.all()
    user_list = [
        {
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        } for user in users
    ]
    return jsonify(users=user_list), 200

# Delete a user (Admins only)
@admin_bp.route('/delete/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify(message="Access denied. Admins only."), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not found"), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify(message="User deleted successfully"), 200
