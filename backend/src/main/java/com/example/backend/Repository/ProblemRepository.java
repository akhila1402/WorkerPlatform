package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Models.Problem;
import com.example.backend.Models.Status;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    List<Problem> findByStatus(Status status);

    List<Problem> findByUserId(Long userId);

    List<Problem> findByCategory(String category);

    List<Problem> findByStatusAndCategory(Status status, String category);
}