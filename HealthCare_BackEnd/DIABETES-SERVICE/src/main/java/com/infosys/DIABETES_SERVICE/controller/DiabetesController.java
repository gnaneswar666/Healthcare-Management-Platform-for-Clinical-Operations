package com.infosys.DIABETES_SERVICE.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.DIABETES_SERVICE.entity.DiabetesData;
import com.infosys.DIABETES_SERVICE.service.DiabetesService;

@RestController
@RequestMapping("/api/diabetes")

public class DiabetesController {

    @Autowired
    private DiabetesService diabetesService;

    @PutMapping("/data")
    public DiabetesData saveOrUpdate(@RequestBody DiabetesData diabetesData) {
        return diabetesService.saveOrUpdate(diabetesData);
    }

    @GetMapping("/data/{patientId}")
    public DiabetesData getDiabetesData(@PathVariable String patientId) {
        return diabetesService.getDiabetesData(patientId);
    }
}