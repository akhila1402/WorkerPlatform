package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.Models.Application;

public interface ApplicationRepository extends MongoRepository<Application, String> {
    public List<Application> findByProblemId(String problemId);
    public List<Application> findByWorkerId(String workerId);
}
