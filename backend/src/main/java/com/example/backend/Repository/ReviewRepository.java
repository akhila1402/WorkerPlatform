package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.Models.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByWorkerId(Long id);

}