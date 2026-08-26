package com.infosys.AI_ANOMALY_SERVICE.detector;


import org.springframework.stereotype.Component;

import com.infosys.AI_ANOMALY_SERVICE.dto.HealthTwinDTO;
import com.infosys.AI_ANOMALY_SERVICE.model.AnomalyResult;


@Component
public class AnomalyDetector {

    public AnomalyResult detect(HealthTwinDTO twin) {

        int score = 0;

        StringBuilder message = new StringBuilder();

        // =========================
        // HEART RATE
        // =========================

        if (twin.getHeartRate() != null) {

            int heartRate = twin.getHeartRate();

            if (heartRate < 50 || heartRate > 120) {

                score += 25;

                message.append(
                    "Abnormal heart rate. "
                );
            }
        }

        // =========================
        // OXYGEN LEVEL
        // =========================

        if (twin.getOxygenLevel() != null) {

            int oxygen = twin.getOxygenLevel();

            if (oxygen < 90) {

                score += 35;

                message.append(
                    "Critical oxygen level. "
                );

            } else if (oxygen < 95) {

                score += 20;

                message.append(
                    "Low oxygen level. "
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

                score += 25;

                message.append(
                    "High temperature. "
                );

            } else if (temperature >= 38) {

                score += 15;

                message.append(
                    "Elevated temperature. "
                );
            }
        }

        // =========================
        // BLOOD PRESSURE
        // =========================

        if (twin.getBloodPressure() != null) {

            String[] bp =
                    twin.getBloodPressure().split("/");

            if (bp.length == 2) {

                try {

                    int systolic =
                            Integer.parseInt(bp[0].trim());

                    int diastolic =
                            Integer.parseInt(bp[1].trim());

                    if (systolic >= 180 ||
                        diastolic >= 120) {

                        score += 35;

                        message.append(
                            "Severely abnormal blood pressure. "
                        );

                    } else if (systolic >= 140 ||
                               diastolic >= 90) {

                        score += 20;

                        message.append(
                            "High blood pressure. "
                        );

                    } else if (systolic < 90 ||
                               diastolic < 60) {

                        score += 20;

                        message.append(
                            "Low blood pressure. "
                        );
                    }

                } catch (NumberFormatException e) {

                    System.out.println(
                        "Invalid blood pressure: "
                        + twin.getBloodPressure()
                    );
                }
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
                    twin.getWeight()
                    / (heightMeters * heightMeters);

            if (bmi >= 30 || bmi < 18.5) {

                score += 15;

                message.append(
                    "Abnormal BMI. "
                );
            }
        }

        // =========================
        // LIMIT SCORE
        // =========================

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

        boolean anomalyDetected =
                score >= 30;

        String finalMessage;

        if (message.length() == 0) {

            finalMessage =
                    "No abnormality detected.";

        } else {

            finalMessage =
                    message.toString();
        }

        return new AnomalyResult(
                twin.getPatientId(),
                anomalyDetected,
                score,
                severity,
                finalMessage
        );
    }
}
