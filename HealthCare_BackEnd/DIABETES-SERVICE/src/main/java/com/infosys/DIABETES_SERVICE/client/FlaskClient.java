package com.infosys.DIABETES_SERVICE.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.infosys.DIABETES_SERVICE.dto.PredictionRequest;
import com.infosys.DIABETES_SERVICE.dto.PredictionResponse;

@FeignClient(name = "FLASK-AI", url = "http://localhost:5000")
public interface FlaskClient {

    @PostMapping("/predict/diabetes")
    PredictionResponse predict(@RequestBody PredictionRequest request);

}
