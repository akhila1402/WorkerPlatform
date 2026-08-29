package com.example.backend.Models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "problems")
public class Problem {
     @Id
    private String id;

    private String userId;

    private String title;

    private String description;

    private String category;     // Electrician, Plumber...

    private String priority;     // Low, Medium, High

    private Status status;      // PENDING, ACCEPTED, COMPLETED

    private String workerId;     // Assigned worker

    private Double latitude;
    private Double longitude;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt; // ID of the worker assigned to this problem


}