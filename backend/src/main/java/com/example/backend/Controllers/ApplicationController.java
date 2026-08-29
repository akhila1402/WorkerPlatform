package com.example.backend.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Models.Application;
import com.example.backend.Service.ApplicationService;

@RequestMapping("/application")
@RestController
public class ApplicationController {
    @Autowired
    private ApplicationService applicationService;

    @PreAuthorize("hasRole('WORKER')")
    @PostMapping("/create")
    public void createApplication(@RequestBody Application application) {
        applicationService.createApplication(application);
    }

    @PreAuthorize("hasAnyRole('WORKER','ADMIN')")
    @GetMapping("/get/{id}")
    public Application getApplicationById(@PathVariable String id) {
        return applicationService.getApplicationById(id);
    }

    @PreAuthorize("hasRole('WORKER')")
    @PutMapping("/update/{id}")
    public void updateApplication(@PathVariable String id, @RequestBody Application application) {
        applicationService.updateApplication(id, application);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public void deleteApplicationById(@PathVariable String id) {
        applicationService.deleteApplicationById(id);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/accept/{id}")
    public void acceptApplication(@PathVariable String id) {
        applicationService.acceptProblem(id);
    }

    @GetMapping("/problem/{problemId}")
    public List<Application> getApplicationsByProblem(
            @PathVariable String problemId) {

        return applicationService
                .getApplicationsByProblem(problemId);
    }

    @GetMapping("/worker/{workerId}")
    public List<Application> getApplicationsByWorker(
            @PathVariable String workerId) {

        return applicationService
                .getApplicationsByWorker(workerId);
    }
}
