from flask import Flask, request, jsonify
from flask_cors import CORS
import razorpay

app = Flask(__name__)
CORS(app, supports_credentials=True)

razorpay_client = razorpay.Client(auth=(
    "rzp_test_bW1uocJtyIMt1H", 
    "c3WQcRUJhsLuvDwD7vXNR4kf"
))

@app.route("/")
def home():
    return "✅ Flask server is running!"

@app.route("/create-order", methods=["POST", "OPTIONS"])
def create_order():
    if request.method == "OPTIONS":
        return '', 204
    data = request.get_json()
    amount = data.get("amount")
    if not amount:
        return jsonify({"error": "Amount required"}), 400

    try:
        order = razorpay_client.order.create({
            "amount": int(amount * 100),  # Convert to paise
            "currency": "INR",
            "payment_capture": 1
        })
        return jsonify({
            "order_id": order["id"],
            "amount": order["amount"] / 100,
            "currency": "INR",
            "razorpay_key_id": "rzp_test_bW1uocJtyIMt1H"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
