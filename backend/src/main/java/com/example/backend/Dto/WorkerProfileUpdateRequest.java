package com.example.backend.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkerProfileUpdateRequest {
    private String profession;
    private Double latitude;
    private Double longitude;
}