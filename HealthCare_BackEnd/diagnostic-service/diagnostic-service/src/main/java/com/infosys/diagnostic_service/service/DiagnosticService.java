package com.infosys.diagnostic_service.service;

import java.util.List;

import com.infosys.diagnostic_service.dto.DiagnosticRequest;
import com.infosys.diagnostic_service.dto.DiagnosticResponse;

public interface DiagnosticService {

    DiagnosticResponse saveOrUpdate(DiagnosticRequest request);

    DiagnosticResponse getByPatientId(String patientId);

    List<DiagnosticResponse> getAll();

    void delete(String patientId);

}
