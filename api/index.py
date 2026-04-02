from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

# MongoDB Connection (Using environment variable for production)
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["PortfolioDB"]
contact_collection = db["contacts"]

@app.route("/api/contact", methods=["POST"])
def save_contact():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        contact_collection.insert_one(data)
        return jsonify({"message": "Message sent successfully! 🚀"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health check route
@app.route("/api/health")
def health():
    return jsonify({"status": "healthy", "service": "portfolio-api"}), 200

# Vercel requires the 'app' object to be exported
if __name__ == "__main__":
    app.run()
