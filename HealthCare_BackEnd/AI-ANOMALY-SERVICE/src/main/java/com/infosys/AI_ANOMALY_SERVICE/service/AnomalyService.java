package com.infosys.AI_ANOMALY_SERVICE.service;

import org.springframework.stereotype.Service;

import com.infosys.AI_ANOMALY_SERVICE.client.HealthTwinClient;
import com.infosys.AI_ANOMALY_SERVICE.dto.HealthTwinDTO;
import com.infosys.AI_ANOMALY_SERVICE.model.AnomalyResult;
import com.infosys.AI_ANOMALY_SERVICE.model.HealthTwin;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnomalyService {

    private final HealthTwinClient healthTwinClient;

    public AnomalyResult detect(String patientId) {

        HealthTwinDTO twin =
                healthTwinClient.getHealthTwin(patientId);

        int score = 0;
        boolean anomalyDetected = false;

        StringBuilder message = new StringBuilder();

        // =========================
        // HEART RATE
        // =========================

        if (twin.getHeartRate() != null) {

            int heartRate = twin.getHeartRate();

            if (heartRate < 50) {

                anomalyDetected = true;
                score += 25;

                message.append(
                    "Very low heart rate. "
                );

            } else if (heartRate > 120) {

                anomalyDetected = true;
                score += 25;

                message.append(
                    "High heart rate. "
                );
            }
        }

        // =========================
        // TEMPERATURE
        // =========================

        if (twin.getTemperature() != null) {

            double temperature =
                    twin.getTemperature();

            if (temperature >= 39) {

                anomalyDetected = true;
                score += 25;

                message.append(
                    "High temperature. "
                );

            } else if (temperature < 35) {

                anomalyDetected = true;
                score += 25;

                message.append(
                    "Low temperature. "
                );
            }
        }

        // =========================
        // OXYGEN
        // =========================

        if (twin.getOxygenLevel() != null) {

            int oxygen =
                    twin.getOxygenLevel();

            if (oxygen < 90) {

                anomalyDetected = true;
                score += 35;

                message.append(
                    "Critical oxygen level. "
                );

            } else if (oxygen < 95) {

                anomalyDetected = true;
                score += 20;

                message.append(
                    "Low oxygen level. "
                );
            }
        }

        // =========================
        // BLOOD PRESSURE
        // =========================

        if (twin.getBloodPressure() != null
                && !twin.getBloodPressure().isBlank()) {

            try {

                String[] bp =
                        twin.getBloodPressure()
                            .split("/");

                int systolic =
                        Integer.parseInt(bp[0].trim());

                int diastolic =
                        Integer.parseInt(bp[1].trim());

                if (systolic >= 140 ||
                    diastolic >= 90) {

                    anomalyDetected = true;
                    score += 25;

                    message.append(
                        "High blood pressure. "
                    );

                } else if (systolic < 90 ||
                           diastolic < 60) {

                    anomalyDetected = true;
                    score += 25;

                    message.append(
                        "Low blood pressure. "
                    );
                }

            } catch (Exception e) {

                message.append(
                    "Invalid blood pressure format. "
                );
            }
        }

        // =========================
        // BMI
        // =========================

        if (twin.getHeight() > 0 &&
            twin.getWeight() > 0) {

            double heightMeters =
                    twin.getHeight() / 100.0;

            double bmi =
                    twin.getWeight() /
                    (heightMeters * heightMeters);

            if (bmi < 18.5) {

                anomalyDetected = true;
                score += 10;

                message.append(
                    "Low BMI. "
                );

            } else if (bmi >= 30) {

                anomalyDetected = true;
                score += 10;

                message.append(
                    "High BMI. "
                );
            }
        }

        // Don't allow score above 100
        score = Math.min(score, 100);

        // =========================
        // SEVERITY
        // =========================

        String severity;

        if (score >= 70) {

            severity = "CRITICAL";

        } else if (score >= 30) {

            severity = "WARNING";

        } else {

            severity = "NORMAL";
        }

        // =========================
        // MESSAGE
        // =========================

        if (!anomalyDetected) {

            message.append(
                "No abnormal health pattern detected."
            );
        }

        // =========================
        // RESULT
        // =========================

        AnomalyResult result =
                new AnomalyResult();

        result.setPatientId(patientId);
        result.setAnomalyDetected(anomalyDetected);
        result.setAnomalyScore(score);
        result.setSeverity(severity);
        result.setMessage(message.toString());

        return result;
    }
}