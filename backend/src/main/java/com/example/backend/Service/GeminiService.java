package com.example.backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.backend.Dto.RecommendationResponse;
import com.example.backend.Models.Application;
import com.example.backend.Models.Problem;
import com.example.backend.Models.Review;
import com.example.backend.Models.Worker;
import com.example.backend.Repository.ApplicationRepository;
import com.example.backend.Repository.ProblemRepository;
import com.example.backend.Repository.ReviewRepository;
import com.example.backend.Repository.WorkerRepository;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

@Service
public class GeminiService {

    @Autowired
    private ProblemRepository problemRepository;
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private WorkerRepository workerRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Value("${gemini.api.key}")
    private String apiKey;
    

    public String enhanceProblemDescription(String description) {
        Client client = Client.builder().apiKey(apiKey).build();
        String prompt = """
                You are helping users write service requests.
                Improve the description professionally.
                IMPORTANT:
                - Do not invent details.
                - Do not assume quantities.
                - Do not add tasks not mentioned.
                - Keep the original meaning.
                - Make the text clearer and more professional.
                Description:""" + description;

        GenerateContentResponse response
                = client.models.generateContent(
                        "gemini-2.5-flash",
                        prompt,
                        null);

        return response.text();
    }

    public RecommendationResponse analyseApplications(String problemId) {
        Client client = Client.builder().apiKey(apiKey).build();
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        List<Application> applications
                = applicationRepository.findByProblemId(problemId);

        if (applications.isEmpty()) {
            throw new RuntimeException("No applications found");
        }

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
            You are helping a customer choose a worker.

            Analyze all applications and suggest the most suitable worker.

            Consider:
            - Worker rating
            - Completed jobs
            - Customer reviews
            - Cost
            - Estimated completion time
            - Application message

            The final decision will be made by the customer.

            Problem Details:
            """);

        prompt.append("\nCategory: ")
                .append(problem.getCategory());

        prompt.append("\nPriority: ")
                .append(problem.getPriority());

        prompt.append("\n\nApplications:\n");

        for (Application application : applications) {

            Worker worker = workerRepository
                    .findById(application.getWorkerId())
                    .orElse(null);

            if (worker == null) {
                continue;
            }

            prompt.append("\n---------------------------------\n");
            prompt.append("WorkerId: ")
                    .append(worker.getId())
                    .append("\n");

            prompt.append("Name: ")
                    .append(worker.getName())
                    .append("\n");

            prompt.append("Profession: ")
                    .append(worker.getProfession())
                    .append("\n");

            prompt.append("Rating: ")
                    .append(worker.getRating())
                    .append("\n");

            prompt.append("Completed Jobs: ")
                    .append(worker.getNoOfProblemsSolved())
                    .append("\n");

            prompt.append("Cost: ")
                    .append(application.getCost())
                    .append("\n");

            prompt.append("Estimated Time: ")
                    .append(application.getEstimatedTime())
                    .append("\n");

            prompt.append("Proposal: ")
                    .append(application.getMessage())
                    .append("\n");

            List<Review> reviews
                    = reviewRepository.findByWorkerId(worker.getId());

            prompt.append("Reviews:\n");

            if (reviews.isEmpty()) {
                prompt.append("No reviews available\n");
            } else {
                for (Review review : reviews) {

                    prompt.append("Rating: ")
                            .append(review.getRating())
                            .append("\n");

                    prompt.append("Review: ")
                            .append(review.getReviewText())
                            .append("\n");
                }
            }
        }

        prompt.append("""
            
            Return:
            1. Recommended Worker ID
            2. Worker Name
            3. Detailed Reason
            """);

        GenerateContentResponse response
                = client.models.generateContent(
                        "gemini-2.5-flash",
                        prompt.toString(),
                        null);

        return new RecommendationResponse(
                "",
                "",
                response.text());
    }
}
