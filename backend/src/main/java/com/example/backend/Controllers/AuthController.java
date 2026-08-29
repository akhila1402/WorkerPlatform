package com.example.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Models.AuthProvider;
import com.example.backend.Models.User;
import com.example.backend.Payload.Request.LoginRequest;
import com.example.backend.Payload.Response.JwtResponse;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Security.Jwt.JwtUtils;
import com.example.backend.Security.Services.UserDetailsImpl;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

@Autowired
AuthenticationManager authenticationManager;

@Autowired
JwtUtils jwtUtils;

@Autowired
UserRepository userRepository;

@Autowired
PasswordEncoder passwordEncoder;

@PostMapping("/signup")
public ResponseEntity<?> registerUser(
        @RequestBody User user) {

    if (userRepository.findByEmail(user.getEmail()) != null) {

        return ResponseEntity
                .badRequest()
                .body("Email already exists");
    }

    user.setPassword(
            passwordEncoder.encode(user.getPassword()));
    user.setAuthProvider(AuthProvider.LOCAL);
    user.setProfileCompleted(true);

    userRepository.save(user);

    return ResponseEntity.ok("User registered successfully");
}

@PostMapping("/login")
public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
            User user = userRepository.findByEmail(loginRequest.getEmail());
    Authentication authentication =
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                             loginRequest.getEmail(),
                             loginRequest.getPassword()));

    SecurityContextHolder.getContext()
            .setAuthentication(authentication);

    String jwt =
            jwtUtils.generateJwtToken(authentication);

    UserDetailsImpl userDetails =
            (UserDetailsImpl) authentication.getPrincipal();

    String role =
            userDetails.getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority();

    return ResponseEntity.ok(
            new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    role,
                    user != null ? user.isProfileCompleted() : true));
}

}
