package com.example.backend.Models;

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
@Document(collection = "applications")
public class Application {
     @Id
    private String id;
    private String problemId;
    private String workerId;
    private Double cost;
    private String message;
    private String estimatedTime;
    private Status status; // PENDING, ACCEPTED, REJECTED
}
