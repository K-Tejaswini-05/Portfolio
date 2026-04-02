from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
import resend

app = Flask(__name__)
CORS(app)

# Email Service (Resend Configuration)
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
resend.api_key = RESEND_API_KEY

# Optional: MongoDB Connection (Using environment variable for production)
MONGO_URI = os.getenv("MONGO_URI")
if MONGO_URI:
    client = MongoClient(MONGO_URI)
    db = client["PortfolioDB"]
    contact_collection = db["contacts"]
else:
    contact_collection = None

@app.route("/api/contact", methods=["POST"])
def save_contact():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        name = data.get("name", "Unknown")
        email_addr = data.get("email", "No Email")
        message = data.get("message", "No Message")

        # 1. Store in MongoDB if available
        if contact_collection:
            contact_collection.insert_one(data)

        # 2. Send email notification via Resend
        if RESEND_API_KEY:
            resend.Emails.send({
                "from": "Portfolio <onboarding@resend.dev>",
                "to": "tejookancharla@gmail.com",
                "subject": f"🚀 New Contact from {name}",
                "html": f"""
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #7c3aed;">New Portfolio Message</h2>
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Email:</strong> {email_addr}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p><strong>Message:</strong></p>
                        <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #7c3aed;">
                            {message}
                        </blockquote>
                    </div>
                """
            })

        return jsonify({"message": "Message sent! I'll reach out soon. 🚀"}), 201

    except Exception as e:
        print(f"Error in contact route: {e}")
        return jsonify({"error": str(e)}), 500

# Health check route
@app.route("/api/health")
def health():
    return jsonify({"status": "healthy", "service": "portfolio-api"}), 200

# Vercel requires the 'app' object to be exported
if __name__ == "__main__":
    app.run()
