from flask import Flask, request, jsonify
from flask_cors import CORS

from predictor.predicator import predict_heart
from predictor.diabetes_predictor import predict_diabetes

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return {
        "service": "MediSphere AI Prediction Service",
        "status": "Running"
    }


@app.route("/predict/heart", methods=["POST"])
def predict():

    data = request.get_json()

    result = predict_heart(data)

    return jsonify(result)


@app.route("/predict/diabetes", methods=["POST"])
def predict_diabetes_route():

    data = request.get_json()

    result = predict_diabetes(data)

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
