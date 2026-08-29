package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Models.Problem;

import com.example.backend.Models.Status;

@Repository
public interface ProblemRepository extends MongoRepository<Problem, String> {
    // Custom query methods for Problem entity can be added here
    public List<Problem> findByStatus(Status status);
    public List<Problem> findByUserId(String userId);
    public List<Problem> findByCategory(String category);
    public List<Problem> findByStatusAndCategory(Status status, String category);
}
