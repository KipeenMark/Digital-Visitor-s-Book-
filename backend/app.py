from flask import Flask, request, jsonify
from datetime import datetime
from bson.objectid import ObjectId
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
try:
    client = MongoClient('mongodb://localhost:27017/')
    db = client['visitors_db']
    visitors_collection = db['visitors']
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

# API Routes
@app.route('/api/visitors', methods=['GET'])
def get_visitors():
    try:
        visitors = list(visitors_collection.find())
        for visitor in visitors:
            visitor['_id'] = str(visitor['_id'])  # Convert ObjectId to string
        return jsonify(visitors), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/visitors', methods=['POST'])
def add_visitor():
    try:
        visitor_data = request.json
        required_fields = ['name', 'email', 'phone', 'purpose', 'hostPerson', 'location']
        visitor_data['timeIn'] = visitor_data.get('timestamp') or datetime.now().isoformat()
        visitor_data['timeOut'] = None
        visitor_data['status'] = 'active'
        
        if not all(field in visitor_data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        visitors_collection.insert_one(visitor_data)
        return jsonify({"message": "Visitor added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/visitors/<email>', methods=['GET'])
def get_visitor_by_email(email):
    try:
        visitor = visitors_collection.find_one({"email": email}, {'_id': 0})
        if visitor:
            return jsonify(visitor), 200
        return jsonify({"error": "Visitor not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/visitors/<visitor_id>/checkout', methods=['POST'])
def checkout_visitor(visitor_id):
    try:
        visitor = visitors_collection.find_one({"_id": ObjectId(visitor_id)})
        if not visitor:
            return jsonify({"error": "Visitor not found"}), 404
            
        if visitor.get('timeOut'):
            return jsonify({"error": "Visitor already checked out"}), 400

        update_result = visitors_collection.update_one(
            {"_id": ObjectId(visitor_id)},
            {
                "$set": {
                    "timeOut": datetime.now().isoformat(),
                    "status": "completed"
                }
            }
        )
        
        if update_result.modified_count:
            return jsonify({"message": "Visitor checked out successfully"}), 200
        return jsonify({"error": "Failed to checkout visitor"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)