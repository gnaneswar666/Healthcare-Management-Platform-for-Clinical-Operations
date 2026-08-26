package com.infosys.DIABETES_SERVICE.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopFactorDTO {

    private String feature;

    private Double value;

    private Double impact;
}