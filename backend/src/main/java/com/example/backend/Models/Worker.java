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
@Document(collection = "workers")
public class Worker {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private Double rating;
    private String mobileNumber;
    private String dob;
    private Integer noOfProblemsSolved;
    private String profession;
    private Double latitude;
    private Double longitude;
    private Boolean approved;

}