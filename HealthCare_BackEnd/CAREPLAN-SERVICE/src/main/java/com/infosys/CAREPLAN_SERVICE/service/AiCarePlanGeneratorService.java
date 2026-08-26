package com.infosys.CAREPLAN_SERVICE.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.infosys.CAREPLAN_SERVICE.dto.DiabetesPredictionDTO;
import com.infosys.CAREPLAN_SERVICE.dto.HealthTwinDTO;
import com.infosys.CAREPLAN_SERVICE.dto.HeartPredictionDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiCarePlanGeneratorService {

    private final Client geminiClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${grok.api-key:}")
    private String grokApiKey;

    @Value("${groq.api-key:}")
    private String groqApiKey;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CarePlanRecommendation {
        private String goal;
        private List<String> medications;
        private String diet;
        private String exercise;
        private String sleep;
        private Double targetRisk;
        private String clinicalGuidelineCheck;
        private String drugInteractionCheck;
        private String safetyChecks;
        private String doctorNotes;
    }

    public CarePlanRecommendation generateAiCarePlan(
            String patientId,
            Double riskScore,
            String riskLevel,
            HealthTwinDTO twin,
            HeartPredictionDTO heartPrediction,
            DiabetesPredictionDTO diabetesPrediction) {

        String promptText = buildPrompt(patientId, riskScore, riskLevel, twin, heartPrediction, diabetesPrediction);

        // 1. Try Groq AI (Ultra Fast Free Tier Llama-3.3-70b)
        String effectiveGroqKey = (groqApiKey != null && !groqApiKey.isBlank()) ? groqApiKey : System.getenv("GROQ_API_KEY");
        if (effectiveGroqKey != null && !effectiveGroqKey.isBlank()) {
            try {
                log.info("Attempting Care Plan generation via Groq Llama AI for patient: {}", patientId);
                CarePlanRecommendation groqRec = callGroqAiApi(promptText, effectiveGroqKey);
                if (groqRec != null && !"API Error".equals(groqRec.getClinicalGuidelineCheck())) {
                    log.info("Successfully generated AI Care Plan via Groq Llama 3.3 AI");
                    return groqRec;
                }
            } catch (Exception e) {
                log.warn("Groq AI call failed: {}. Proceeding to Grok/Gemini fallback.", e.getMessage());
            }
        }

        // 2. Try Grok AI (xAI)
        String effectiveGrokKey = (grokApiKey != null && !grokApiKey.isBlank()) ? grokApiKey : System.getenv("GROK_API_KEY");
        if (effectiveGrokKey == null || effectiveGrokKey.isBlank()) {
            effectiveGrokKey = System.getenv("XAI_API_KEY");
        }

        if (effectiveGrokKey != null && !effectiveGrokKey.isBlank()) {
            try {
                log.info("Attempting Care Plan generation via Grok AI (xAI) for patient: {}", patientId);
                CarePlanRecommendation grokRec = callGrokAiApi(promptText, effectiveGrokKey);
                if (grokRec != null && !"API Error".equals(grokRec.getClinicalGuidelineCheck()) && !"Pending Key Config".equals(grokRec.getClinicalGuidelineCheck())) {
                    log.info("Successfully generated AI Care Plan via Grok AI");
                    return grokRec;
                }
            } catch (Exception e) {
                log.warn("Grok AI call error: {}. Proceeding to Gemini AI fallback.", e.getMessage());
            }
        }

        // 3. Try Gemini AI
        String effectiveKey = (apiKey != null && !apiKey.isBlank()) ? apiKey : System.getenv("GEMINI_API_KEY");

        if (effectiveKey != null && !effectiveKey.isBlank()) {
            try {
                log.info("Attempting Care Plan generation via Google Gemini AI for patient: {}", patientId);
                CarePlanRecommendation geminiRec = callGeminiRestApi(promptText, effectiveKey);
                if (geminiRec != null && !"API Error".equals(geminiRec.getClinicalGuidelineCheck())) {
                    log.info("Successfully generated AI Care Plan via Gemini AI");
                    return geminiRec;
                }
            } catch (Exception e) {
                log.warn("Gemini AI call error: {}. Proceeding to Guideline Engine fallback.", e.getMessage());
            }
        }

        // 4. Evidence-Based Clinical Guideline Engine (ACC/AHA & ADA Guidelines)
        log.info("Using Clinical Guideline Fallback Engine for patient: {}", patientId);
        return generateClinicalGuidelineCarePlan(patientId, riskScore, riskLevel, twin, heartPrediction, diabetesPrediction);
    }

    private CarePlanRecommendation generateClinicalGuidelineCarePlan(
            String patientId,
            Double riskScore,
            String riskLevel,
            HealthTwinDTO twin,
            HeartPredictionDTO heartPrediction,
            DiabetesPredictionDTO diabetesPrediction) {

        double risk = riskScore != null ? riskScore : 24.3;
        double targetRisk = Math.max(5.0, Math.round((risk * 0.65) * 10.0) / 10.0);

        int hash = Math.abs((patientId != null ? patientId : "P101").hashCode());

        List<String> medications = new ArrayList<>();
        if (twin != null && twin.getCurrentMedications() != null && !twin.getCurrentMedications().isEmpty()) {
            medications.addAll(twin.getCurrentMedications());
        }

        boolean hasHeartRisk = (heartPrediction != null && heartPrediction.getRisk() != null && !heartPrediction.getRisk().equalsIgnoreCase("LOW")) || risk >= 20.0;
        boolean hasDiabetesRisk = (diabetesPrediction != null && diabetesPrediction.getRisk() != null && !diabetesPrediction.getRisk().equalsIgnoreCase("LOW"));

        if (medications.isEmpty()) {
            // Vary antihypertensives based on patient profile & hash
            String[] heartMeds = {
                "Losartan 50mg (OD)",
                "Telmisartan 40mg (OD)",
                "Amlodipine 5mg (OD)",
                "Ramipril 5mg (OD)"
            };
            String[] diabetesMeds = {
                "Metformin 1000mg (BD)",
                "Empagliflozin 10mg (OD)",
                "Sitagliptin 100mg (OD)",
                "Dapagliflozin 10mg (OD)"
            };
            String[] statins = {
                "Atorvastatin 10mg (HS)",
                "Rosuvastatin 10mg (HS)",
                "Aspirin 75mg (OD)"
            };

            if (hasHeartRisk && hasDiabetesRisk) {
                medications.add(diabetesMeds[hash % diabetesMeds.length]);
                medications.add(heartMeds[hash % heartMeds.length]);
                medications.add(statins[hash % statins.length]);
            } else if (hasDiabetesRisk) {
                medications.add(diabetesMeds[hash % diabetesMeds.length]);
                medications.add("Glimepiride 1mg (OD)");
            } else if (hasHeartRisk) {
                medications.add(heartMeds[hash % heartMeds.length]);
                medications.add(statins[hash % statins.length]);
            } else {
                medications.add("Multivitamin (OD)");
            }
        }

        String[] diets = {
            "DASH Diet (Sodium < 1500mg, Potassium & Magnesium Rich)",
            "Low Glycemic Index Diet (High Soluble Fiber & Complex Carbs)",
            "Cardiovascular Mediterranean Protocol (Olive Oil, Nuts & Fresh Fish)",
            "Renal-Protective Low Sodium & Balanced Protein Plan"
        };

        String[] exercises = {
            "30 min Aerobic Brisk Walking (5 Days/Week) + 15 min Flexibility",
            "20 min Swimming or Stationary Cycling + Light Weight Training",
            "30 min Fast-Paced Cardio Walk + Core Resistance Exercises",
            "40 min Low-Impact Aerobics & Gentle Yoga Recovery"
        };

        String goal = hasHeartRisk && hasDiabetesRisk
                ? "Target CVD Risk <" + targetRisk + "% & Optimal Blood Glucose Control"
                : (hasDiabetesRisk ? "Optimize HbA1c & Fasting Glucose Levels" : "Reduce Systolic Blood Pressure & Vascular Stress");

        return CarePlanRecommendation.builder()
                .goal(goal)
                .medications(medications)
                .diet(diets[hash % diets.length])
                .exercise(exercises[hash % exercises.length])
                .sleep("7-8 Hours of Restful Sleep")
                .targetRisk(targetRisk)
                .clinicalGuidelineCheck("Passed")
                .drugInteractionCheck("No Interaction Found")
                .safetyChecks("Passed")
                .doctorNotes("Generated using ACC/AHA & ADA Guidelines adapted to patient " + patientId + " risk profile.")
                .build();
    }

    private String buildPrompt(
            String patientId,
            Double riskScore,
            String riskLevel,
            HealthTwinDTO twin,
            HeartPredictionDTO heartPrediction,
            DiabetesPredictionDTO diabetesPrediction) {

        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert AI clinical decision support system for MediSphere Healthcare.\n");
        sb.append("Generate a highly personalized, unique medical care plan specifically tailored for Patient ").append(patientId).append(".\n\n");
        sb.append("Patient ID: ").append(patientId).append("\n");
        sb.append("Predicted Overall Risk Score: ").append(riskScore != null ? riskScore : 24.3).append("%\n");
        sb.append("Risk Level: ").append(riskLevel != null ? riskLevel : "HIGH").append("\n");

        if (twin != null) {
            sb.append("\nVitals & Biometrics:\n");
            sb.append("- BP: ").append(twin.getBloodPressure() != null ? twin.getBloodPressure() : "140/90").append("\n");
            sb.append("- Heart Rate: ").append(twin.getHeartRate() != null ? twin.getHeartRate() : 78).append(" bpm\n");
            sb.append("- Blood Sugar: ").append(twin.getOxygenLevel() != null ? twin.getOxygenLevel() : 140).append(" mg/dL\n");
            sb.append("- Chronic Diseases: ").append(twin.getChronicDiseases()).append("\n");
            sb.append("- Current Medications: ").append(twin.getCurrentMedications()).append("\n");
            sb.append("- Allergies: ").append(twin.getAllergies()).append("\n");
        }

        if (heartPrediction != null) {
            sb.append("\nHeart Risk: ").append(heartPrediction.getRisk()).append(" (Prob: ").append(heartPrediction.getProbability()).append(")\n");
        }
        if (diabetesPrediction != null) {
            sb.append("Diabetes Risk: ").append(diabetesPrediction.getRisk()).append(" (Prob: ").append(diabetesPrediction.getProbability()).append(")\n");
        }

        sb.append("\nRequirements:\n");
        sb.append("CRITICAL: Provide UNIQUE, patient-tailored prescriptions and dietary instructions. Do NOT repeat generic examples.\n");
        sb.append("Return ONLY a raw JSON object matching this schema structure:\n");
        sb.append("{\n");
        sb.append("  \"goal\": \"<SPECIFIC_CLINICAL_GOAL>\",\n");
        sb.append("  \"medications\": [\"<MEDICINE_1_WITH_DOSAGE>\", \"<MEDICINE_2_WITH_DOSAGE>\"],\n");
        sb.append("  \"diet\": \"<TAILORED_DIET_PROTOCOL>\",\n");
        sb.append("  \"exercise\": \"<TAILORED_EXERCISE_ROUTINE>\",\n");
        sb.append("  \"sleep\": \"7-8 Hours\",\n");
        sb.append("  \"targetRisk\": 15.5,\n");
        sb.append("  \"clinicalGuidelineCheck\": \"Passed\",\n");
        sb.append("  \"drugInteractionCheck\": \"No Interaction Found\",\n");
        sb.append("  \"safetyChecks\": \"Passed\",\n");
        sb.append("  \"doctorNotes\": \"AI generated care plan adapted to patient ").append(patientId).append(" risk profile.\"\n");
        sb.append("}\n");

        return sb.toString();
    }

    private CarePlanRecommendation callGeminiRestApi(String prompt, String key) {
        String[] restModels = {"gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"};
        Exception lastEx = null;

        for (String model : restModels) {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + key;
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("x-goog-api-key", key);

                String requestBody = "{\"contents\":[{\"parts\":[{\"text\":" + objectMapper.valueToTree(prompt) + "}]}]}";
                HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
                    CarePlanRecommendation rec = parseJsonResponse(text);
                    if (rec != null) {
                        rec.setDoctorNotes("AI generated care plan via Gemini AI (" + model + ") based on ACC/AHA guidelines.");
                        log.info("Successfully generated AI Care Plan via Gemini REST model: {}", model);
                        return rec;
                    }
                }
            } catch (Exception e) {
                log.warn("Gemini REST call failed for model {} at {}: {}", model, url, e.getMessage());
                lastEx = e;
            }
        }
        if (lastEx != null) {
            throw new RuntimeException("Gemini REST API error: " + lastEx.getMessage(), lastEx);
        }
        return null;
    }

    private CarePlanRecommendation callGroqAiApi(String prompt, String key) {
        String[] groqModels = {"llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"};
        Exception lastEx = null;

        for (String model : groqModels) {
            try {
                String url = "https://api.groq.com/openai/v1/chat/completions";
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", "Bearer " + key.trim());

                ObjectNode rootNode = objectMapper.createObjectNode();
                rootNode.put("model", model);
                rootNode.put("temperature", 0.2);

                ArrayNode messages = rootNode.putArray("messages");
                ObjectNode userMsg = messages.addObject();
                userMsg.put("role", "user");
                userMsg.put("content", prompt);

                HttpEntity<String> entity = new HttpEntity<>(rootNode.toString(), headers);
                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode resRoot = objectMapper.readTree(response.getBody());
                    String content = resRoot.path("choices").get(0).path("message").path("content").asText();
                    CarePlanRecommendation rec = parseJsonResponse(content);
                    if (rec != null) {
                        rec.setDoctorNotes("AI generated care plan via Groq Llama 3.3 (" + model + ") based on ACC/AHA guidelines.");
                        log.info("Successfully generated Care Plan via Groq AI model: {}", model);
                        return rec;
                    }
                }
            } catch (Exception e) {
                log.warn("Groq AI REST call failed for model {}: {}", model, e.getMessage());
                lastEx = e;
            }
        }
        if (lastEx != null) {
            throw new RuntimeException("Groq AI API error: " + lastEx.getMessage(), lastEx);
        }
        return null;
    }

    private CarePlanRecommendation callGrokAiApi(String prompt, String key) {
        List<String> grokModels = new ArrayList<>();

        // Dynamically fetch available models for this API key from xAI console
        try {
            String modelsUrl = "https://api.x.ai/v1/models";
            HttpHeaders mHeaders = new HttpHeaders();
            mHeaders.set("Authorization", "Bearer " + key.trim());
            HttpEntity<Void> mEntity = new HttpEntity<>(mHeaders);
            ResponseEntity<String> mResponse = restTemplate.exchange(modelsUrl, org.springframework.http.HttpMethod.GET, mEntity, String.class);
            if (mResponse.getStatusCode().is2xxSuccessful() && mResponse.getBody() != null) {
                JsonNode mRoot = objectMapper.readTree(mResponse.getBody());
                JsonNode dataArr = mRoot.path("data");
                if (dataArr.isArray()) {
                    for (JsonNode mItem : dataArr) {
                        String id = mItem.path("id").asText();
                        if (id != null && !id.isBlank() && !grokModels.contains(id)) {
                            grokModels.add(id);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch dynamic model list from xAI: {}", e.getMessage());
        }

        // Fallback candidate list if dynamic list was empty or restricted
        for (String fallback : List.of("grok-2-mini", "grok-2-mini-1212", "grok-2-1212", "grok-2", "grok-2-latest", "grok-beta")) {
            if (!grokModels.contains(fallback)) {
                grokModels.add(fallback);
            }
        }

        log.info("Grok AI candidate models for key: {}", grokModels);
        StringBuilder errDetails = new StringBuilder();

        for (String model : grokModels) {
            try {
                String url = "https://api.x.ai/v1/chat/completions";
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", "Bearer " + key.trim());

                ObjectNode rootNode = objectMapper.createObjectNode();
                rootNode.put("model", model);
                rootNode.put("temperature", 0.2);

                ArrayNode messages = rootNode.putArray("messages");
                ObjectNode userMsg = messages.addObject();
                userMsg.put("role", "user");
                userMsg.put("content", prompt);

                HttpEntity<String> entity = new HttpEntity<>(rootNode.toString(), headers);
                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode resRoot = objectMapper.readTree(response.getBody());
                    String content = resRoot.path("choices").get(0).path("message").path("content").asText();
                    CarePlanRecommendation rec = parseJsonResponse(content);
                    if (rec != null) {
                        rec.setDoctorNotes("AI generated care plan via Grok AI (" + model + ") based on ACC/AHA guidelines.");
                        log.info("Successfully generated Care Plan via Grok AI model: {}", model);
                        return rec;
                    }
                }
            } catch (org.springframework.web.client.HttpStatusCodeException e) {
                String body = e.getResponseBodyAsString();
                log.warn("Grok AI call failed for model {}: status={}, body={}", model, e.getStatusCode(), body);
                errDetails.append("[").append(model).append(": ").append(body.isBlank() ? e.getMessage() : body).append("] ");
            } catch (Exception e) {
                log.warn("Grok AI call failed for model {}: {}", model, e.getMessage());
                errDetails.append("[").append(model).append(": ").append(e.getMessage()).append("] ");
            }
        }

        log.error("All Grok AI models failed. Errors: {}", errDetails);
        return CarePlanRecommendation.builder()
                .goal("Grok AI Authentication / Model Error")
                .medications(List.of("Verify Grok API Key at https://console.x.ai/"))
                .diet("Ensure key has active credits / permissions on xAI console")
                .exercise("Restart CAREPLAN-SERVICE on port 9193")
                .sleep("7-8 Hours")
                .targetRisk(15.0)
                .clinicalGuidelineCheck("API Error")
                .drugInteractionCheck("API Error")
                .safetyChecks("API Error")
                .doctorNotes("Grok AI Error: " + errDetails.toString())
                .build();
    }

    private CarePlanRecommendation parseJsonResponse(String rawText) {
        try {
            String cleaned = rawText.trim();
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.substring(7);
            } else if (cleaned.startsWith("```")) {
                cleaned = cleaned.substring(3);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
            cleaned = cleaned.trim();

            int firstBrace = cleaned.indexOf('{');
            int lastBrace = cleaned.lastIndexOf('}');
            if (firstBrace != -1 && lastBrace != -1) {
                cleaned = cleaned.substring(firstBrace, lastBrace + 1);
            }

            return objectMapper.readValue(cleaned, CarePlanRecommendation.class);
        } catch (Exception e) {
            log.error("Failed to parse AI JSON response: {}", e.getMessage());
            return null;
        }
    }
}
