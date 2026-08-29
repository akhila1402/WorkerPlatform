package com.example.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Dto.EnhanceDescriptionRequest;
import com.example.backend.Dto.EnhanceDescriptionResponse;
import com.example.backend.Dto.RecommendationRequest;
import com.example.backend.Dto.RecommendationResponse;
import com.example.backend.Service.GeminiService;

@RestController
@RequestMapping("/ai")
public class AiController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/enhance-description")
    public EnhanceDescriptionResponse enhanceDescription(@RequestBody EnhanceDescriptionRequest request) {

        String result =
                geminiService.enhanceProblemDescription(
                        request.getDescription());

        return new EnhanceDescriptionResponse(result);
    }
    @PostMapping("/analyse-applications")
    public RecommendationResponse analyseApplications(@RequestBody RecommendationRequest request) {

        return geminiService.analyseApplications(request.getProblemId());
    }

}