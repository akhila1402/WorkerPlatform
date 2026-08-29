package com.example.backend.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Models.Review;
import com.example.backend.Service.ReviewService;

@RequestMapping("/review")
@RestController
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Customer reviews a worker after work completion
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/create")
    public void createReview(@RequestBody Review review) {

        reviewService.createReview(review);
    }

    // Customer can update his review
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/update")
    public void updateReview(
            @RequestParam String id,
            @RequestBody Review review) {

        reviewService.updateReview(id, review);
    }

    // Customer or Admin can delete a review
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/delete")
    public void deleteReview(@RequestParam String id) {

        reviewService.deleteReview(id);
    }

    @GetMapping("/worker/{workerId}")
    public List<Review> getReviewsByWorker(
            @PathVariable String workerId) {

        return reviewService
                .getReviewsByWorker(workerId);
    }
}