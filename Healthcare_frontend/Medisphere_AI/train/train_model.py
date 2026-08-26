import os
import joblib
import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

from xgboost import XGBClassifier

# -----------------------------
# Create folders
# -----------------------------
os.makedirs("models", exist_ok=True)
os.makedirs("datasets", exist_ok=True)

# -----------------------------
# Load Dataset
# -----------------------------
df = pd.read_csv("datasets/heart.csv")

# Change this if your target column has another name
TARGET = "target"

X = df.drop(TARGET, axis=1)
y = df[TARGET]

# -----------------------------
# Train Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -----------------------------
# Standard Scaling
# -----------------------------
scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Save scaler
joblib.dump(scaler, "models/scaler.pkl")

# Save background for SHAP
pd.DataFrame(X_train.iloc[:100]).to_csv(
    "datasets/background.csv",
    index=False
)

print("\nScaler Saved")
print("Background Saved")

# ==========================================================
# RANDOM FOREST
# ==========================================================

print("\n==============================")
print("Training Random Forest")
print("==============================")

rf = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

rf.fit(X_train_scaled, y_train)

rf_pred = rf.predict(X_test_scaled)

print("Accuracy :", accuracy_score(y_test, rf_pred))

print(classification_report(y_test, rf_pred))

joblib.dump(rf, "models/heart_rf.pkl")

print("Random Forest Saved")

# ==========================================================
# XGBOOST
# ==========================================================

print("\n==============================")
print("Training XGBoost")
print("==============================")

xgb = XGBClassifier(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=4,
    random_state=42,
    eval_metric="logloss"
)

xgb.fit(X_train_scaled, y_train)

xgb_pred = xgb.predict(X_test_scaled)

print("Accuracy :", accuracy_score(y_test, xgb_pred))

print(classification_report(y_test, xgb_pred))

joblib.dump(xgb, "models/heart_xgboost.pkl")

print("XGBoost Saved")

# ==========================================================
# ANN
# ==========================================================

print("\n==============================")
print("Training ANN")
print("==============================")

ann = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(13,)),
    tf.keras.layers.Dense(64, activation="relu"),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(32, activation="relu"),
    tf.keras.layers.Dense(16, activation="relu"),
    tf.keras.layers.Dense(1, activation="sigmoid")
])

ann.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

ann.fit(
    X_train_scaled,
    y_train,
    validation_split=0.2,
    epochs=100,
    batch_size=16,
    verbose=1
)

loss, acc = ann.evaluate(
    X_test_scaled,
    y_test,
    verbose=0
)

print("Accuracy :", acc)

ann.save("models/heart_ann.keras")

print("ANN Saved")

# ==========================================================
# SUMMARY
# ==========================================================

print("\n=========================================")
print("Training Completed Successfully")
print("=========================================")

print("Generated Files:")
print("models/scaler.pkl")
print("models/heart_rf.pkl")
print("models/heart_xgboost.pkl")
print("models/heart_ann.keras")
print("datasets/background.csv")