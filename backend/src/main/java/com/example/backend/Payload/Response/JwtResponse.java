package com.example.backend.Payload.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class JwtResponse {

    private String token;
    private String type = "Bearer";
    private String id;
    private String email;
    private String role;
    private boolean profileCompleted;

    public JwtResponse(String token,
                       String id,
                       String email,
                       String role) {

        this.token = token;
        this.id = id;
        this.email = email;
        this.role = role;
        this.profileCompleted = true;
    }

    public JwtResponse(String token,
                       String id,
                       String email,
                       String role,
                       boolean profileCompleted) {

        this.token = token;
        this.id = id;
        this.email = email;
        this.role = role;
        this.profileCompleted = profileCompleted;
    }
}