package com.example.backend.Service;

import java.util.Collections;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.Models.AuthProvider;
import com.example.backend.Models.Role;
import com.example.backend.Models.User;
import com.example.backend.Payload.Response.JwtResponse;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Security.Jwt.JwtUtils;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
public class GoogleAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    private void debugLog(String message) {
        try {
            java.nio.file.Files.write(
                java.nio.file.Paths.get("/home/user/Desktop/MY_PROJECTS/WorkerPlatform/auth_debug.log"),
                (new java.util.Date() + " - " + message + "\n").getBytes(),
                java.nio.file.StandardOpenOption.CREATE,
                java.nio.file.StandardOpenOption.APPEND
            );
        } catch (Exception e) {
            // ignore
        }
    }

    public JwtResponse loginWithGoogle(String idTokenString, String registrationType) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), 
                new GsonFactory())
            .setAudience(Collections.singletonList(googleClientId))
            .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
            throw new IllegalArgumentException("Invalid Google ID Token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        if (email == null) {
            throw new IllegalArgumentException("Email not found in Google ID Token");
        }

        debugLog("=== GOOGLE AUTH ATTEMPT ===");
        debugLog("Incoming Email: " + email);
        debugLog("Incoming Registration Type: " + registrationType);

        User user = userRepository.findByEmail(email);

        if (user == null) {
            debugLog("User does not exist in DB. Creating a new account...");
            user = new User();
            user.setEmail(email);
            
            String name = (String) payload.get("name");
            if (name == null || name.trim().isEmpty()) {
                name = email.split("@")[0];
            }
            user.setUsername(name);
            
            Role assignedRole = Role.USER;
            if ("WORKER".equalsIgnoreCase(registrationType)) {
                assignedRole = Role.WORKER;
            }
            debugLog("Role selected for new account: " + assignedRole);
            user.setRole(assignedRole);
            user.setAuthProvider(AuthProvider.GOOGLE);
            user.setProfileCompleted(false);
            
            // Set a secure, random dummy password
            user.setPassword(passwordEncoder.encode("OAUTH_DUMMY_PASSWORD_" + UUID.randomUUID()));
            
            user = userRepository.save(user);
            debugLog("New Google account saved to DB. ID: " + user.getId() + ", Role: " + user.getRole());
        } else {
            debugLog("Existing user found in DB. Preserving role: " + user.getRole());
        }

        // Generate JWT token from username (email)
        String jwt = jwtUtils.generateTokenFromUsername(email);

        String roleName = "ROLE_" + user.getRole().name();
        
        return new JwtResponse(
            jwt,
            user.getId(),
            user.getEmail(),
            roleName,
            user.isProfileCompleted()
        );
    }
}
