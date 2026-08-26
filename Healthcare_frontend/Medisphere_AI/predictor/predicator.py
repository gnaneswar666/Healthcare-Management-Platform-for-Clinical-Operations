import numpy as np
import pandas as pd
import joblib
import tensorflow as tf
import shap
import time
import os

# Load scaler only once
scaler = joblib.load("models/scaler.pkl")

FEATURE_NAMES = [
    "Age",
    "Gender",
    "Chest Pain Type",
    "Resting Blood Pressure",
    "Cholesterol",
    "Fasting Blood Sugar",
    "Rest ECG",
    "Maximum Heart Rate",
    "Exercise Induced Angina",
    "Old Peak",
    "Slope",
    "Major Vessels",
    "Thalassemia"
]

# Column names used during scaler training (from heart.csv)
SCALER_COLUMNS = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"]


def get_recommendation(feature):

    recommendations = {
        "Age": "Regular cardiovascular screening is recommended.",
        "Gender": "Discuss gender-specific cardiovascular risk factors with your doctor.",
        "Chest Pain Type": "Clinical evaluation of chest pain is recommended.",
        "Resting Blood Pressure": "Monitor blood pressure and reduce salt intake.",
        "Cholesterol": "Maintain a heart-healthy diet and reduce cholesterol.",
        "Fasting Blood Sugar": "Monitor blood sugar and follow a diabetic-friendly diet.",
        "Rest ECG": "Further ECG evaluation may be beneficial.",
        "Maximum Heart Rate": "Follow a supervised exercise program.",
        "Exercise Induced Angina": "Consult a cardiologist before strenuous exercise.",
        "Old Peak": "Stress test evaluation is recommended.",
        "Slope": "Cardiology consultation is advised.",
        "Major Vessels": "Further coronary imaging may be required.",
        "Thalassemia": "Discuss thalassemia findings with a specialist."
    }

    return recommendations.get(feature, "Consult your physician.")


def predict_heart(data):

    start_time = time.perf_counter()

    # -----------------------------
    # Load Active Model
    # -----------------------------
    model_file = data["modelFile"]
    model_version = data["modelVersion"]

    model_path = os.path.join("models", model_file)

    print("================================")

    print("Model File:", model_file)
    print("Model Path:", os.path.abspath(model_path))
    print("Exists    :", os.path.exists(model_path))

    if os.path.exists(model_path):
        print("File Size :", os.path.getsize(model_path), "bytes")
    print("================================")

    if model_file.endswith(".keras") or model_file.endswith(".h5"):
        model = tf.keras.models.load_model(model_path)
    else:
        model = joblib.load(model_path)
    print("Model Type:", type(model))
    # -----------------------------
    # Input Features
    # -----------------------------
    features = np.array([[
        data["age"],
        data["sex"],
        data["cp"],
        data["trestbps"],
        data["chol"],
        data["fbs"],
        data["restecg"],
        data["thalach"],
        data["exang"],
        data["oldpeak"],
        data["slope"],
        data["ca"],
        data["thal"]
    ]])

    # Convert to DataFrame with feature names to avoid scaler warnings
    feature_df = pd.DataFrame(features, columns=SCALER_COLUMNS)
    features = scaler.transform(feature_df)

    # -----------------------------
    # Prediction
    # -----------------------------
    if model_file.endswith(".keras") or model_file.endswith(".h5"):
        probability = float(model.predict(features, verbose=0)[0][0])
    else:
        probability = float(model.predict_proba(features)[0][1])

    prediction = (
        "Heart Disease"
        if probability >= 0.5
        else "No Heart Disease"
    )

    # -----------------------------
    # SHAP
    # -----------------------------
    # Load background as DataFrame (with headers) for scaler compatibility
    background_df = pd.read_csv("datasets/background.csv")
    background = scaler.transform(background_df)

    # SHAP Explanation - handle different model types properly
    if model_file.endswith(".keras") or model_file.endswith(".h5"):
        explainer = shap.GradientExplainer(model, background)
        shap_values = explainer.shap_values(features)
        # For GradientExplainer, shap_values is a list with one element for binary output
        if isinstance(shap_values, list):
            raw_values = np.squeeze(shap_values[0])
        else:
            raw_values = np.squeeze(shap_values)
    else:
        explainer = shap.TreeExplainer(
            model,
            feature_perturbation="tree_path_dependent"
        )
        shap_values = explainer.shap_values(features)
        # Handle different SHAP output formats for binary classification:
        # 1) List of 2 arrays [class0, class1] - older format
        # 2) 3D array (1, n_features, 2) - newer format
        if isinstance(shap_values, list):
            # For binary classification, take the positive class (index 1)
            if len(shap_values) >= 2:
                raw_values = np.squeeze(shap_values[1])
            else:
                raw_values = np.squeeze(shap_values[0])
        elif hasattr(shap_values, 'ndim') and shap_values.ndim == 3:
            # Newer SHAP versions return 3D array: take class 1 (index 1)
            raw_values = shap_values[0, :, 1]
        else:
            raw_values = np.squeeze(shap_values)

    # Ensure we have a 1D array
    if raw_values.ndim > 1:
        values = raw_values.flatten()
    else:
        values = raw_values

    importance = np.abs(values)

    indices = np.argsort(importance)[::-1][:3]

    top_factors = []
    recommendations = []

    for i in indices:

        top_factors.append({
            "feature": FEATURE_NAMES[int(i)],
            "value": round(float(features[0][i]), 3),
            "impact": round(float(values[i]), 4)
        })

        recommendations.append(
            get_recommendation(FEATURE_NAMES[int(i)])
        )

    # -----------------------------
    # Prediction Time
    # -----------------------------
    end_time = time.perf_counter()

    prediction_time = round((end_time - start_time) * 1000, 2)

    # -----------------------------
    # Risk
    # -----------------------------
    if probability >= 0.8:
        risk = "HIGH"
    elif probability >= 0.5:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {

        "disease": "Heart Disease",

        "prediction": prediction,

        "risk": risk,

        "probability": round(probability * 100, 2),

        "confidence": round(
            max(probability, 1 - probability) * 100,
            2
        ),

        "modelVersion": model_version,

        "predictionTime": prediction_time,

        "topFactors": top_factors,

        "recommendations": recommendations

    }