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
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String mobileNumber;
    private String password;
    private Role role;
    private String dob;
    private String address;
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
