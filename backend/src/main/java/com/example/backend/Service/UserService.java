package com.example.backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.Models.User;
import com.example.backend.Repository.UserRepository;

@Service
public class UserService {
    // Business logic for user management
    @Autowired
    private UserRepository userRepository;

    public void createUser(User user) {
        System.out.println("Creating user: " + user.getUsername());
        userRepository.save(user);
        System.out.println("User created: " + user.getUsername());
    }
    public User getUser(String id) {
        return userRepository.findById(id).orElse(null);
    }
    public void updateUser(User user) {
        User existingUser = userRepository.findById(user.getId()).orElse(null);
        if (existingUser != null) {
            if (user.getUsername() != null) {
                existingUser.setUsername(user.getUsername());
            }
            if (user.getMobileNumber() != null) {
                existingUser.setMobileNumber(user.getMobileNumber());
            }
            if (user.getDob() != null) {
                existingUser.setDob(user.getDob());
            }
            if (user.getAddress() != null) {
                existingUser.setAddress(user.getAddress());
            }
            existingUser.setProfileCompleted(true);
            userRepository.save(existingUser);
        } else {
            userRepository.save(user);
        }
    }
    public void deleteUser(String id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            userRepository.delete(user);
        }
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public long countUsers() {
        return userRepository.count();
    }
}
