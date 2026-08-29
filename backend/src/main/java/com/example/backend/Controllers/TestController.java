package com.example.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Service.EmailService;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/email")
    public String testEmail() {

        emailService.sendMail(
                "ambatihruthik2005@gmail.com",
                "Spring Boot Test",
                "Email sending is working!");

        return "Email Sent";
    }
    @GetMapping("/slow")
    public String slow() throws Exception {
        Thread.sleep(15000);
        return "Completed";
    }
}
