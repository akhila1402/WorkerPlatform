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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Dto.WorkerProfileUpdateRequest;
import com.example.backend.Models.Worker;
import com.example.backend.Service.WorkerService;

@RequestMapping("/worker")
@RestController
public class WorkerController {

    @Autowired
    private WorkerService workerService;

    @PreAuthorize("hasAnyRole('WORKER','ADMIN')")
    @PostMapping("/create")
    public void createWorker(@RequestBody Worker worker) {
        workerService.createWorker(worker);
    }

    @PreAuthorize("hasAnyRole('WORKER','ADMIN','USER')")
    @GetMapping("/get/{id}")
    public Worker getWorkerById(@PathVariable String id) {
        return workerService.getWorkerById(id);
    }

    @PreAuthorize("hasRole('WORKER')")
    @PutMapping("/update/{id}")
    public void updateWorker(@PathVariable String id,
            @RequestBody WorkerProfileUpdateRequest request) {
        workerService.updateWorkerProfile(id, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public void deleteWorkerById(@PathVariable String id) {
        workerService.deleteWorker(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAll")
    public List<Worker> getAllWorkers() {
        return workerService.getAllWorkers();
    }

    @PreAuthorize("hasAnyRole('USER','WORKER','ADMIN')")
    @GetMapping("/getByProfession/{profession}")
    public List<Worker> getWorkerByProfession(@PathVariable String profession) {
        return workerService.getWorkerByProfession(profession);
    }

    @PreAuthorize("hasAnyRole('USER','WORKER','ADMIN')")
    @GetMapping("/getNearbyWorkers")
    public List<Worker> getNearbyWorkers(@RequestParam Double latitude, @RequestParam Double longitude, @RequestParam Double radius, @RequestParam String profession) {
        return workerService.getNearbyWorkers(latitude, longitude, radius, profession);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approve/{id}")
    public void approveWorker(@PathVariable String id) {
        workerService.approveWorker(id);
    }
}
