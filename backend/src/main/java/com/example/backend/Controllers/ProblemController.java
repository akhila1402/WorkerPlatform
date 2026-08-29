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

import com.example.backend.Models.Problem;
import com.example.backend.Models.Status;
import com.example.backend.Service.ProblemService;

@RestController
@RequestMapping("/problem")
public class ProblemController {
    @Autowired
    private ProblemService problemService;
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/create")
    public void createProblem(@RequestBody Problem problem) {
        // Implementation for creating a problem
        problemService.createProblem(problem);
    }
    @PreAuthorize("hasAnyRole('USER','WORKER','ADMIN')")
    @GetMapping("/get")
    public Problem getProblem(@RequestParam String id) {
        // Implementation for getting a problem
        System.out.println("Problem retrieved");
        return problemService.getProblem(id);
    }
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/updateStatus")
    public void updateStatus(@RequestParam String id, @RequestParam String status) {
        problemService.updateStatus(id, status);
    }
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/update")
    public void updateProblem(@RequestParam String id,@RequestBody Problem problem) {
        // Implementation for updating a problem
        problemService.updateProblem(id, problem);
    }
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/getByStatus")
    public List<Problem> getProblemsByStatus(@RequestParam Status status) {
        // Implementation for getting problems by status
        return problemService.getProblemsByStatus(status);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAll")
    public List<Problem> getAllProblems() {
        // Implementation for getting all problems
        return problemService.getAllProblems();
    }
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/getByUserId/{userId}")
    public List<Problem> getProblemsByUserId(@PathVariable String userId) {
        // Implementation for getting problems by user ID
        return problemService.getProblemsByUserId(userId);
    }
    @PreAuthorize("hasAnyRole('WORKER','ADMIN')")
    @GetMapping("/getByCategory/{category}")
    public List<Problem> getProblemsByCategory(@PathVariable String category) {
        // Implementation for getting problems by category
        return problemService.getProblemsByCategory(category);
    }
    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('WORKER','ADMIN')")
    public List<Problem> getAvailableProblems() {
        // Implementation for getting available problems
        return problemService.getAvailableProblems();
    }
    
}
