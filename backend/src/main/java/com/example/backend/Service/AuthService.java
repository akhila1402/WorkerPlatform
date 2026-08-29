package com.example.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.backend.Models.User;

public class AuthService {
    @Autowired
    UserService userService;
    @Autowired
    WorkerService workerService;
    public boolean authenticateUser(String userId, String password) {
        User user = userService.getUser(userId);
        if (user != null && user.getPassword().equals(password)) {
            return true; // Authentication successful
        }
        return false; // Authentication failed
    }   
}
