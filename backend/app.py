from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__, static_folder="../dist", static_url_path="")
CORS(app)

# MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["PortfolioDB"]
profile_collection = db["profile"]
contact_collection = db["contacts"]

# ---------- API ----------
@app.route("/api/profile")
def get_profile():
    data = profile_collection.find_one({}, {"_id": 0})
    return jsonify(data)

@app.route("/api/contact", methods=["POST"])
def save_contact():
    contact_collection.insert_one(request.json)
    return jsonify({"message": "Message sent successfully"})

# ---------- FRONTEND ----------
@app.route("/")
def serve_frontend():
    # If dist folder doesn't exist, this might fail, so we check for index.html
    return send_from_directory("../dist", "index.html")

@app.route("/<path:path>")
def serve_static_files(path):
    return send_from_directory("../dist", path)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
