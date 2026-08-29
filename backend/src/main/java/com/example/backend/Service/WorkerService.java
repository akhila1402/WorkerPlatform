package com.example.backend.Service;

import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.Dto.WorkerProfileUpdateRequest;
import com.example.backend.Models.Worker;
import com.example.backend.Repository.WorkerRepository;

@Service
public class WorkerService {

    // Business logic for worker management
    @Autowired
    private WorkerRepository workerRepository;

    public void createWorker(Worker worker) {
        if (worker.getApproved() == null) {
            worker.setApproved(false);
        }
        workerRepository.save(worker);
    }

    public Worker getWorker(String id) {
        return workerRepository.findById(id).orElse(null);
    }

    public void deleteWorker(String id) {
        Worker worker = workerRepository.findById(id).orElse(null);
        if (worker != null) {
            workerRepository.delete(worker);
        }
    }

    public Worker getWorkerById(String id) {
        return workerRepository.findById(id).orElse(null);
    }

    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    public List<Worker> getWorkerByProfession(String profession) {
        return workerRepository.findByProfession(profession);
    }

    public Double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        // Haversine formula to calculate distance between two points on the Earth
        final int R = 6371; // Radius of the Earth in kilometers
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    }

    public List<Worker> getNearbyWorkers(Double latitude, Double longitude, Double radius, String profession) {
        List<Worker> result = new LinkedList<>();

        List<Worker> workers
                = workerRepository.findByProfessionAndApproved(profession, true);

        for (Worker worker : workers) {
            double distance = calculateDistance(latitude, longitude, worker.getLatitude(), worker.getLongitude());
            if (distance <= radius) {
                result.add(worker);
            }
        }

        return result;
    }

    public void updateWorkerProfile(String id, WorkerProfileUpdateRequest request) {
        Worker worker = workerRepository.findById(id).orElse(null);

        if (worker == null) {
            throw new RuntimeException("Worker not found");
        }

        worker.setProfession(request.getProfession());
        worker.setLatitude(request.getLatitude());
        worker.setLongitude(request.getLongitude());

        workerRepository.save(worker);
    }

    public void approveWorker(String id) {
        Worker worker = workerRepository.findById(id).orElse(null);

        if (worker == null) {
            throw new RuntimeException("Worker not found");
        }

        worker.setApproved(true);
        workerRepository.save(worker);
    }

    public void saveWorker(Worker worker) {
        workerRepository.save(worker);
    }
}

