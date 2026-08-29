package com.example.backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.Models.Application;
import com.example.backend.Models.Problem;
import com.example.backend.Models.Status;
import com.example.backend.Repository.ApplicationRepository;
import com.example.backend.Repository.ProblemRepository;

@Service
public class ApplicationService {
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private ProblemRepository problemRepository;

    public void createApplication(Application application) {
        applicationRepository.save(application);
    }

    public List<Application> getApplicationsByProblem(String problemId) {
        return applicationRepository.findByProblemId(problemId);
    }

    public Application getApplicationById(String id) {
        return applicationRepository.findById(id).orElse(null);
    }

    public void updateApplication(String id, Application application) {
        application.setId(id);
        applicationRepository.save(application);
    }

    public void deleteApplicationById(String id) {
        applicationRepository.deleteById(id);
    }

    public void acceptProblem(String applicationId) {

        Application application = applicationRepository.findById(applicationId)
                .orElse(null);

        if (application == null) {
            throw new RuntimeException("Application not found");
        }

        if (application.getStatus() != Status.PENDING) {
            throw new RuntimeException("Application already processed");
        }

        // Accept selected application
        application.setStatus(Status.ACCEPTED);
        applicationRepository.save(application);

        // Update problem
        Problem problem = problemRepository.findById(application.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        problem.setStatus(Status.ASSIGNED);
        problem.setWorkerId(application.getWorkerId());

        problemRepository.save(problem);

        // now we need to reject all other pending applications for the same problem

        List<Application> applications = applicationRepository.findByProblemId(
                application.getProblemId());

        for (Application app : applications) {

            if (!app.getId().equals(applicationId)
                    && app.getStatus().equals(Status.PENDING)) {

                app.setStatus(Status.REJECTED);
                applicationRepository.save(app);
            }
        }
    }

    public List<Application> getApplicationsByWorker(String workerId) {
        return applicationRepository.findByWorkerId(workerId);
    }

}
