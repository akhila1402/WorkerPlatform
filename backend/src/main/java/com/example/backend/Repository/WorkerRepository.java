package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.Models.Worker;

public interface WorkerRepository extends MongoRepository<Worker, String> {
    List<Worker> findByProfession(String profession);
    Worker findByEmail(String email);
     List<Worker> findByProfessionAndApproved(String profession, Boolean approved);
}