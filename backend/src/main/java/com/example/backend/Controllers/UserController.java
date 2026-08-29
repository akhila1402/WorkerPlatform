package com.example.backend.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
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

import com.example.backend.Models.User;
import com.example.backend.Service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private MongoTemplate mongoTemplate;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public void createUser(@RequestBody User user) {
        userService.createUser(user);
        System.out.println("User created: " + user.getUsername());
    }

    @PreAuthorize("hasAnyRole('USER','WORKER','ADMIN')")
    @GetMapping("/get")
    public User getUser(@RequestParam String id) {
        return userService.getUser(id);
    }

    @PreAuthorize("hasAnyRole('USER','WORKER')")
    @PutMapping("/update")
    public void updateUser(@RequestBody User user) {
        userService.updateUser(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAll")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/count")
    public long countUsers() {
        return userService.countUsers();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/db")
    public String getDb() {
        return mongoTemplate.getDb().getName();
    }
}