package com.infosys.consestService.service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.consestService.Modal.ConsestService;
import com.infosys.consestService.Resources.ConsestServiceRepository;
import com.infosys.consestService.exception.ResourceNotFoundException;

@Service
public class ConsestServiceService {

    @Autowired
    private ConsestServiceRepository repo;

    // Create Consent
    public ConsestService createConsent(ConsestService consent) {

        Instant now = Instant.now();

        consent.setGrantedDate(now);
        consent.setStatus(consent.getStatus() != null ? consent.getStatus() : "GRANTED");
        consent.setConsentType(consent.getConsentType() != null ? consent.getConsentType() : "GENERAL_HEALTHCARE");
        consent.setExpiryDate(
                now.atZone(ZoneOffset.UTC)
                        .plusMonths(6)
                        .toInstant());

        return repo.save(consent);
    }

    // Get Consent
    public ConsestService getConsentByPatientId(String patientId) {

        return repo.findByPatientId(patientId)
                .orElseGet(() -> {
                    ConsestService defaultConsent = new ConsestService();
                    defaultConsent.setPatientId(patientId);
                    defaultConsent.setStatus("REVOKED");
                    defaultConsent.setConsentType("GENERAL_HEALTHCARE");
                    return defaultConsent;
                });
    }

    // Update Consent
    public ConsestService updateConsent(String consentId, ConsestService consent) {

        ConsestService existing = repo.findById(consentId)
                .orElseGet(() -> {
                    ConsestService newC = new ConsestService();
                    newC.setId(consentId);
                    return newC;
                });

        Instant now = Instant.now();
        if (consent.getConsentType() != null) {
            existing.setConsentType(consent.getConsentType());
        }
        if (consent.getStatus() != null) {
            existing.setStatus(consent.getStatus());
        }
        if (consent.getPatientId() != null) {
            existing.setPatientId(consent.getPatientId());
        }
        if (existing.getGrantedDate() == null) {
            existing.setGrantedDate(now);
        }
        existing.setExpiryDate(now.atZone(ZoneOffset.UTC).plusMonths(6).toInstant());

        return repo.save(existing);
    }

    // Revoke Consent
    public ConsestService revokeConsent(String consentId) {

        ConsestService consent = repo.findById(consentId)
                .orElseGet(() -> {
                    ConsestService newC = new ConsestService();
                    newC.setId(consentId);
                    return newC;
                });

        consent.setStatus("REVOKED");

        return repo.save(consent);
    }

    public List<ConsestService> getAllConsents(){
        return repo.findAll();
    }

    public ConsestService revokeConsentByPatient(String patientId) {
        ConsestService consent = repo
                .findByPatientId(patientId)
                .orElseGet(() -> {
                    ConsestService newC = new ConsestService();
                    newC.setPatientId(patientId);
                    return newC;
                });

        consent.setStatus("REVOKED");
        return repo.save(consent);
    }

    public ConsestService grantConsentByPatient(String patientId, String consentType) {
        ConsestService consent = repo
                .findByPatientId(patientId)
                .orElseGet(() -> {
                    ConsestService newC = new ConsestService();
                    newC.setPatientId(patientId);
                    return newC;
                });

        Instant now = Instant.now();
        consent.setStatus("GRANTED");
        consent.setConsentType(consentType != null && !consentType.trim().isEmpty() ? consentType : "GENERAL_HEALTHCARE");
        consent.setGrantedDate(now);
        consent.setExpiryDate(now.atZone(ZoneOffset.UTC).plusMonths(6).toInstant());

        return repo.save(consent);
    }
}