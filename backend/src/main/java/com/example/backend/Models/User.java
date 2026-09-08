package com.example.backend.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String mobileNumber;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String dob;
    private String address;

    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider = AuthProvider.LOCAL;

    private Boolean profileCompleted = true;

    public AuthProvider getAuthProvider() {
        return authProvider != null ? authProvider : AuthProvider.LOCAL;
    }

    public boolean isProfileCompleted() {
        if (getAuthProvider() == AuthProvider.LOCAL) {
            return true;
        }
        return profileCompleted != null ? profileCompleted : true;
    }
}