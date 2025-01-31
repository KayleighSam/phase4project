from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from models import db, User

admin_bp = Blueprint('admin_bp', __name__)

# ✅ Admin Login Route
@admin_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    admin = User.query.filter_by(email=data['email'], role='admin').first()

    if not admin or not check_password_hash(admin.password, data['password']):
        return jsonify(message="Invalid email or password"), 401

    # Generate JWT with admin role
    access_token = create_access_token(identity=admin.user_id, additional_claims={"role": "admin"})
    return jsonify({
        "access_token": access_token,
        "email": admin.email,
        "role": "admin"
    }), 200

# ✅ Register a New Admin (Requires Admin Privileges)
@admin_bp.route('/admin/register', methods=['POST'])
@jwt_required()
def register_admin():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify(message="Access denied. Admins only."), 403

    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify(message="An admin with this email already exists."), 400

    new_admin = User(
        name=data['name'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        role="admin"
    )

    db.session.add(new_admin)
    db.session.commit()
    return jsonify(message="Admin user created successfully"), 201

# ✅ Get All Users (Admins Only)
@admin_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def list_users():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify(message="Access denied. Admins only."), 403

    users = User.query.all()
    user_list = [{"user_id": user.user_id, "name": user.name, "email": user.email, "role": user.role} for user in users]
    return jsonify(users=user_list), 200

# ✅ Delete a User (Admins Only)
@admin_bp.route('/admin/delete/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify(message="Access denied. Admins only."), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not found"), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify(message="User deleted successfully"), 200
