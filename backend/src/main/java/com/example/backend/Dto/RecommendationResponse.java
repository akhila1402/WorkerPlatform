package com.example.backend.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RecommendationResponse {

    private String workerId;
    private String workerName;
    private String reason;
}
