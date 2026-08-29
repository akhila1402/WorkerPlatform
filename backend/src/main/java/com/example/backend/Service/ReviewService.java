package com.example.backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.Models.Review;
import com.example.backend.Models.Worker;
import com.example.backend.Repository.ReviewRepository;
import com.example.backend.Repository.WorkerRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private WorkerRepository workerRepository;

    public void createReview(Review review) {

    reviewRepository.save(review);

    List<Review> reviews =
            reviewRepository.findByWorkerId(
                    review.getWorkerId());

    int totalRating = 0;

    for (Review r : reviews) {
        totalRating += r.getRating();
    }

    double avgRating = 0;

    if (!reviews.isEmpty()) {
        avgRating =
                (double) totalRating /
                reviews.size();
    }

    Worker worker =
            workerRepository.findById(
                    review.getWorkerId())
                    .orElse(null);

    if (worker != null) {

        worker.setRating(avgRating);

        workerRepository.save(worker);
    }
}

    public Review getReview(String id) {
        return reviewRepository.findById(id).orElse(null);
    }

    public void updateReview(String id, Review review) {

        Review existingReview= reviewRepository.findById(id).orElse(null);

        if (existingReview != null) {

            review.setId(id);

            reviewRepository.save(review);
        }
    }

    public void deleteReview(String id) {

        Review review
                = reviewRepository.findById(id)
                        .orElse(null);

        if (review != null) {
            reviewRepository.delete(review);
        }
    }
    public List<Review> getReviewsByWorker(String workerId){
        return reviewRepository.findByWorkerId(workerId);
    }
}
