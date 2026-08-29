package com.example.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Payload.Request.TokenRequest;
import com.example.backend.Payload.Response.JwtResponse;
import com.example.backend.Service.GoogleAuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class GoogleAuthController {

    @Autowired
    private GoogleAuthService googleAuthService;

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogleUser(@RequestBody TokenRequest tokenRequest) {
        try {
            JwtResponse jwtResponse = googleAuthService.loginWithGoogle(
                    tokenRequest.getIdToken(), 
                    tokenRequest.getRegistrationType());
            return ResponseEntity.ok(jwtResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Authentication failed: " + e.getMessage());
        }
    }
}
