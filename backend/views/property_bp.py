from flask import Blueprint, request, jsonify
from models import db, Property

property_bp = Blueprint('property_bp', __name__)

# Add a new property
@property_bp.route('/property', methods=['POST'])
def add_property():
    data = request.get_json()
    new_property = Property(
        title=data['title'],
        description=data.get('description', ''),
        price=data['price'],
        location=data['location'],
        type=data['type'],
        availability_status=data['availability_status'],
        image_url=data.get('image_url', '')
    )
    db.session.add(new_property)
    db.session.commit()
    return jsonify(message="Property added successfully"), 201

# Get all properties
@property_bp.route('/properties', methods=['GET'])
def get_properties():
    properties = Property.query.all()
    result = []
    for property in properties:
        result.append({
            'property_id': property.property_id,  # Corrected to property_id
            'title': property.title,
            'description': property.description,
            'price': property.price,
            'location': property.location,
            'type': property.type,
            'availability_status': property.availability_status,
            'image_url': property.image_url
        })
    return jsonify(properties=result)

# Get a specific property by ID
@property_bp.route('/property/<int:id>', methods=['GET'])
def get_property(id):
    property = Property.query.get(id)
    if not property:
        return jsonify(message="Property not found"), 404

    return jsonify({
        'title': property.title,
        'description': property.description,
        'price': property.price,
        'location': property.location,
        'type': property.type,
        'availability_status': property.availability_status,
        'image_url': property.image_url
    })
