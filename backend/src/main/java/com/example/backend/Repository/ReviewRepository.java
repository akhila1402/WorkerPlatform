package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.Models.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {
    // Custom query methods for Review entity can be added here
    public List<Review> findByWorkerId(String id);
}
