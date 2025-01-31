from flask import Blueprint, request, jsonify
from models import db, Listing, Property, User

listing_bp = Blueprint('listing_bp', __name__)

# Create a new listing
@listing_bp.route('/listing', methods=['POST'])
def create_listing():
    data = request.get_json()
    new_listing = Listing(
        property_id=data['property_id'],
        user_id=data['user_id'],
        status=data['status']
    )
    db.session.add(new_listing)
    db.session.commit()
    return jsonify(message="Listing created successfully"), 201

# Get all listings
@listing_bp.route('/listings', methods=['GET'])
def get_listings():
    listings = Listing.query.all()
    result = []
    for listing in listings:
        result.append({
            'property_id': listing.property_id,
            'user_id': listing.user_id,
            'status': listing.status,
            'listing_date': listing.listing_date
        })
    return jsonify(listings=result)
