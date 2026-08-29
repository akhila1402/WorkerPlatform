package com.example.backend.Payload.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenRequest {
    private String idToken;
    private String registrationType;
}
