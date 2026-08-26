import os
import joblib
import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

from xgboost import XGBClassifier

# -----------------------------
# Create folders
# -----------------------------
os.makedirs("models", exist_ok=True)
os.makedirs("datasets", exist_ok=True)

# -----------------------------
# Load Dataset
# -----------------------------
df = pd.read_csv("datasets/diabetes_prediction_dataset.csv")

print("Dataset Shape:", df.shape)
print("Columns:", df.columns.tolist())
print("Target Distribution:\n", df["diabetes"].value_counts())
print("Missing Values:\n", df.isnull().sum())

# -----------------------------
# Preprocessing
# -----------------------------

# Encode gender: Female -> 0, Male -> 1, Other -> 2
df["gender"] = df["gender"].map({"Female": 0, "Male": 1, "Other": 2})

# Encode smoking_history: Label encode
smoking_map = {
    "never": 0,
    "No Info": 1,
    "former": 2,
    "current": 3,
    "ever": 4,
    "not current": 5
}
df["smoking_history"] = df["smoking_history"].map(smoking_map)

# Verify no nulls after encoding
assert df.isnull().sum().sum() == 0, "Null values found after encoding!"

TARGET = "diabetes"

X = df.drop(TARGET, axis=1)
y = df[TARGET]

print("\nFeature Columns:", X.columns.tolist())
print("Feature Shape:", X.shape)
print("Target Shape:", y.shape)

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

print(f"\nTrain size: {len(X_train)}, Test size: {len(X_test)}")

# -----------------------------
# Standard Scaling
# -----------------------------
scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Save scaler
joblib.dump(scaler, "models/diabetes_scaler.pkl")

# Save background for SHAP (unscaled first 100 rows)
pd.DataFrame(X_train.iloc[:100]).to_csv(
    "datasets/diabetes_background.csv",
    index=False
)

print("\nScaler Saved -> models/diabetes_scaler.pkl")
print("Background Saved -> datasets/diabetes_background.csv")

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

rf_acc = accuracy_score(y_test, rf_pred)
rf_prec = precision_score(y_test, rf_pred)
rf_rec = recall_score(y_test, rf_pred)
rf_f1 = f1_score(y_test, rf_pred)

print("Accuracy :", rf_acc)
print("Precision:", rf_prec)
print("Recall   :", rf_rec)
print("F1 Score :", rf_f1)
print("\nConfusion Matrix:\n", confusion_matrix(y_test, rf_pred))
print("\nClassification Report:\n", classification_report(y_test, rf_pred))

joblib.dump(rf, "models/diabetes_rf.pkl")

print("Random Forest Saved -> models/diabetes_rf.pkl")

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

xgb_acc = accuracy_score(y_test, xgb_pred)
xgb_prec = precision_score(y_test, xgb_pred)
xgb_rec = recall_score(y_test, xgb_pred)
xgb_f1 = f1_score(y_test, xgb_pred)

print("Accuracy :", xgb_acc)
print("Precision:", xgb_prec)
print("Recall   :", xgb_rec)
print("F1 Score :", xgb_f1)
print("\nConfusion Matrix:\n", confusion_matrix(y_test, xgb_pred))
print("\nClassification Report:\n", classification_report(y_test, xgb_pred))

joblib.dump(xgb, "models/diabetes_xgboost.pkl")

print("XGBoost Saved -> models/diabetes_xgboost.pkl")

# ==========================================================
# ANN
# ==========================================================

print("\n==============================")
print("Training ANN")
print("==============================")

input_dim = X_train_scaled.shape[1]

ann = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(input_dim,)),
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

loss, ann_acc = ann.evaluate(
    X_test_scaled,
    y_test,
    verbose=0
)

# For ANN, get predictions to compute metrics
ann_pred_prob = ann.predict(X_test_scaled, verbose=0)
ann_pred = (ann_pred_prob >= 0.5).astype(int).flatten()

ann_prec = precision_score(y_test, ann_pred)
ann_rec = recall_score(y_test, ann_pred)
ann_f1 = f1_score(y_test, ann_pred)

print("Accuracy :", ann_acc)
print("Precision:", ann_prec)
print("Recall   :", ann_rec)
print("F1 Score :", ann_f1)
print("\nConfusion Matrix:\n", confusion_matrix(y_test, ann_pred))
print("\nClassification Report:\n", classification_report(y_test, ann_pred))

ann.save("models/diabetes_ann.keras")

print("ANN Saved -> models/diabetes_ann.keras")

# ==========================================================
# SUMMARY
# ==========================================================

print("\n=========================================")
print("Training Completed Successfully")
print("=========================================")

print("\nGenerated Files:")
print("├── models/diabetes_scaler.pkl")
print("├── models/diabetes_rf.pkl")
print("├── models/diabetes_xgboost.pkl")
print("├── models/diabetes_ann.keras")
print("└── datasets/diabetes_background.csv")

print("\nModel Performance Summary:")
print(f"  Random Forest : Acc={rf_acc:.4f}, Prec={rf_prec:.4f}, Rec={rf_rec:.4f}, F1={rf_f1:.4f}")
print(f"  XGBoost       : Acc={xgb_acc:.4f}, Prec={xgb_prec:.4f}, Rec={xgb_rec:.4f}, F1={xgb_f1:.4f}")
print(f"  ANN           : Acc={ann_acc:.4f}, Prec={ann_prec:.4f}, Rec={ann_rec:.4f}, F1={ann_f1:.4f}")

