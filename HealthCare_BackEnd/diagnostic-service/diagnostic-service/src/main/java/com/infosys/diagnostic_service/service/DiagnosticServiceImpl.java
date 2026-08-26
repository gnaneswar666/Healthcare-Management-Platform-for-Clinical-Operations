package com.infosys.diagnostic_service.service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.diagnostic_service.dto.DiagnosticRequest;
import com.infosys.diagnostic_service.dto.DiagnosticResponse;
import com.infosys.diagnostic_service.model.DiagnosticRecord;
import com.infosys.diagnostic_service.repository.DiagnosticRepository;

@Service

public class DiagnosticServiceImpl implements DiagnosticService {

	@Autowired
    private  DiagnosticRepository repository;

    @Override
    public DiagnosticResponse saveOrUpdate(DiagnosticRequest request) {

        DiagnosticRecord record = repository.findByPatientId(request.getPatientId())
                .orElse(new DiagnosticRecord());

        // Set values
        record.setPatientId(request.getPatientId());
        record.setCp(request.getCp());
        record.setChol(request.getChol());
        record.setFbs(request.getFbs());
        record.setRestecg(request.getRestecg());
        record.setExang(request.getExang());
        record.setOldpeak(request.getOldpeak());
        record.setSlope(request.getSlope());
        record.setCa(request.getCa());
        record.setThal(request.getThal());

        record.setSource(request.getSource());
        record.setRecordedBy(request.getRecordedBy());

        if (record.getCreatedAt() == null) {
            record.setCreatedAt(LocalDateTime.now());
        }

        record.setUpdatedAt(LocalDateTime.now());

        repository.save(record);

        return mapToResponse(record);
    }

    @Override
    public DiagnosticResponse getByPatientId(String patientId) {

        DiagnosticRecord record = repository.findByPatientId(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Diagnostic Record Not Found"));

        return mapToResponse(record);
    }

    @Override
    public List<DiagnosticResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(String patientId) {

        DiagnosticRecord record = repository.findByPatientId(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Diagnostic Record Not Found"));

        repository.delete(record);
    }

    private DiagnosticResponse mapToResponse(DiagnosticRecord record) {

        DiagnosticResponse response = new DiagnosticResponse();

        response.setId(record.getId());
        response.setPatientId(record.getPatientId());
        response.setCp(record.getCp());
        response.setChol(record.getChol());
        response.setFbs(record.getFbs());
        response.setRestecg(record.getRestecg());
        response.setExang(record.getExang());
        response.setOldpeak(record.getOldpeak());
        response.setSlope(record.getSlope());
        response.setCa(record.getCa());
        response.setThal(record.getThal());
        response.setSource(record.getSource());
        response.setRecordedBy(record.getRecordedBy());
        response.setCreatedAt(record.getCreatedAt());
        response.setUpdatedAt(record.getUpdatedAt());

        return response;
    }
}
