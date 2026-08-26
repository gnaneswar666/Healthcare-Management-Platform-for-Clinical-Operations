import numpy as np
import pandas as pd
import joblib
import tensorflow as tf
import shap
import time
import os

# Load scaler only once
diabetes_scaler = joblib.load("models/diabetes_scaler.pkl")

FEATURE_NAMES = [
    "Gender",
    "Age",
    "Hypertension",
    "Heart Disease",
    "Smoking History",
    "BMI",
    "HbA1c Level",
    "Blood Glucose Level"
]

# Column names used during scaler training (from diabetes dataset)
DIABETES_SCALER_COLUMNS = [
    "gender", "age", "hypertension", "heart_disease",
    "smoking_history", "bmi", "HbA1c_level", "blood_glucose_level"
]


def get_diabetes_recommendation(feature):
    """Return medical recommendations for each diabetes feature."""

    recommendations = {
        "Gender": "Discuss gender-specific diabetes risk factors with your doctor.",
        "Age": "Regular diabetes screening is recommended, especially after age 45.",
        "Hypertension": "Control blood pressure through diet, exercise, and medication if prescribed.",
        "Heart Disease": "Monitor cardiovascular health closely; heart disease and diabetes are linked.",
        "Smoking History": "Smoking increases diabetes complications. Consider a smoking cessation program.",
        "BMI": "Maintain a healthy BMI through balanced diet and regular physical activity.",
        "HbA1c Level": "Monitor HbA1c regularly. Target levels vary; consult your physician.",
        "Blood Glucose Level": "Monitor blood glucose regularly and follow your diabetic management plan."
    }

    return recommendations.get(feature, "Consult your physician.")


def predict_diabetes(data):
    """
    Predict diabetes using the active model file.

    Expected input data keys:
        gender, age, hypertension, heart_disease, smoking_history,
        bmi, HbA1c_level, blood_glucose_level, modelFile, modelVersion
    """
    start_time = time.perf_counter()

    # -----------------------------
    # Load Active Model
    # -----------------------------
    model_file = data["modelFile"]
    model_version = data["modelVersion"]

    model_path = os.path.join("models", model_file)

    print("================================")
    print("Diabetes Model File:", model_file)
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
    # Encode categorical inputs
   # Spring Boot already sends encoded numeric values
    gender_val = int(data["gender"])
    smoking_val = int(data["smoking_history"])
    features = np.array([[
        gender_val,
        data["age"],
        data["hypertension"],
        data["heart_disease"],
        smoking_val,
        data["bmi"],
        data["HbA1c_level"],
        data["blood_glucose_level"]
    ]])

    # Convert to DataFrame with feature names to avoid scaler warnings
    feature_df = pd.DataFrame(features, columns=DIABETES_SCALER_COLUMNS)
    scaled_features = diabetes_scaler.transform(feature_df)

    # -----------------------------
    # Prediction
    # -----------------------------
    if model_file.endswith(".keras") or model_file.endswith(".h5"):
        probability = float(model.predict(scaled_features, verbose=0)[0][0])
    else:
        probability = float(model.predict_proba(scaled_features)[0][1])

    prediction = (
        "Diabetes"
        if probability >= 0.5
        else "No Diabetes"
    )

    # -----------------------------
    # SHAP Explanation
    # -----------------------------
    # Load background as DataFrame for scaler compatibility
    background_df = pd.read_csv("datasets/diabetes_background.csv")
    background = diabetes_scaler.transform(background_df)

    # SHAP Explanation - handle different model types properly
    if model_file.endswith(".keras") or model_file.endswith(".h5"):
        explainer = shap.GradientExplainer(model, background)
        shap_values = explainer.shap_values(scaled_features)
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
        shap_values = explainer.shap_values(scaled_features)
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
            "value": round(float(scaled_features[0][i]), 3),
            "impact": round(float(values[i]), 4)
        })

        recommendations.append(
            get_diabetes_recommendation(FEATURE_NAMES[int(i)])
        )

    # -----------------------------
    # Prediction Time
    # -----------------------------
    end_time = time.perf_counter()

    prediction_time = round((end_time - start_time) * 1000, 2)

    # -----------------------------
    # Risk Level
    # -----------------------------
    if probability >= 0.8:
        risk = "HIGH"
    elif probability >= 0.5:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "disease": "Diabetes",
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

