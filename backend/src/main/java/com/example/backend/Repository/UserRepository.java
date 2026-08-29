package com.example.backend.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.Models.User;

public interface UserRepository extends MongoRepository<User, String> {
    public User findByEmail(String email);
}
