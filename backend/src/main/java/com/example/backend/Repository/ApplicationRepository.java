package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.Models.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByProblemId(Long problemId);

    List<Application> findByWorkerId(Long workerId);
}