package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.Models.Worker;

public interface WorkerRepository extends JpaRepository<Worker, Long> {

    List<Worker> findByProfession(String profession);

    Worker findByEmail(String email);

    List<Worker> findByProfessionAndApproved(String profession, Boolean approved);
}