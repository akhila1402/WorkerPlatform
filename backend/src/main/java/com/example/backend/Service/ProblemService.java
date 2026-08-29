package com.example.backend.Service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.Models.Problem;
import com.example.backend.Models.Status;
import com.example.backend.Models.Worker;
import com.example.backend.Repository.ProblemRepository;
import com.example.backend.Utils.XssUtil;
@Service
public class ProblemService {
    @Autowired
    private ProblemRepository problemRepository;
    @Autowired
    private WorkerService workerService;
    @Autowired
    private EmailService emailService;
    // Business logic for problem management
    public void createProblem(Problem problem) {
        // Sanitize the title and description to prevent XSS attacks
        problem.setTitle(XssUtil.sanitize(problem.getTitle()));
        problem.setDescription(XssUtil.sanitize(problem.getDescription()));
        problemRepository.save(problem);
        List<Worker> workers=workerService.getNearbyWorkers(problem.getLatitude(),problem.getLongitude(),5.0,problem.getCategory());
       for (Worker worker : workers) {
            emailService.sendMail(worker.getEmail(),"New Job Available","A new "+ problem.getCategory()+ " job has been posted near you.");
        }
    }

    public Problem getProblem(String id) {
        // Implementation for getting a problem
        return problemRepository.findById(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        // Implementation for updating problem status
        Problem problem = problemRepository.findById(id).orElse(null);
        if (problem != null) {
            Status newStatus = Status.valueOf(status.toUpperCase());
            if (newStatus == Status.COMPLETED && problem.getStatus() != Status.COMPLETED) {
                if (problem.getWorkerId() != null) {
                    Worker worker = workerService.getWorkerById(problem.getWorkerId());
                    if (worker != null) {
                        Integer solved = worker.getNoOfProblemsSolved();
                        worker.setNoOfProblemsSolved(solved == null ? 1 : solved + 1);
                        workerService.saveWorker(worker);
                    }
                }
            }
            problem.setStatus(newStatus);
            problemRepository.save(problem);
        }
    }

    public void updateProblem(String id, Problem problem) {
        Problem existingProblem = problemRepository.findById(id).orElse(null);
        if (existingProblem != null && existingProblem.getStatus().equals(Status.PENDING)) {
            existingProblem.setTitle(XssUtil.sanitize(problem.getTitle()));
            existingProblem.setDescription(XssUtil.sanitize(problem.getDescription()));
            existingProblem.setLatitude(problem.getLatitude());
            existingProblem.setLongitude(problem.getLongitude());
            existingProblem.setCategory(problem.getCategory());
            problemRepository.save(existingProblem);
        }
    }
    public List<Problem> getProblemsByStatus(Status status) {
        return problemRepository.findByStatus(status);
}
    public List<Problem> getAllProblems() {
        // Implementation for getting all problems
        return problemRepository.findAll();
    }
    public List<Problem> getProblemsByUserId(String userId) {
        // Implementation for getting problems by user ID
        return problemRepository.findByUserId(userId);
    }
    public List<Problem> getProblemsByCategory(String category) {
        // Implementation for getting problems by category
        return problemRepository.findByCategory(category);
    }
    public List<Problem> getAvailableProblems() {
        // Implementation for getting available problems
        return problemRepository.findByStatus(Status.PENDING);
    }
}
