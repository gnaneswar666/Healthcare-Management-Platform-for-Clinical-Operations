package com.infosys.explanation_service.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.explanation_service.model.Explanation;
import com.infosys.explanation_service.service.ExplanationService;


@RestController
@RequestMapping("/api/explanations")

public class ExplanationController {

    @Autowired
    private ExplanationService service;

    @GetMapping("/patient/{patientId}")
    public Explanation generateLatestExplanation(
            @PathVariable String patientId) {

        return service.generateLatestExplanation(patientId);
    }

}
