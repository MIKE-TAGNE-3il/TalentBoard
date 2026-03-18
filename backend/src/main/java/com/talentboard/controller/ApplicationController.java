package com.talentboard.controller;

import com.talentboard.entity.*;
import com.talentboard.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Gestion des candidatures")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Postuler à une offre", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> apply(@RequestBody ApplyRequest request,
                                   @AuthenticationPrincipal UserDetails userDetails) {
        User applicant = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        if (applicationRepository.existsByJobIdAndApplicantId(request.getJobId(), applicant.getId())) {
            return ResponseEntity.badRequest().body("Vous avez déjà postulé à cette offre");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Offre introuvable"));

        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .coverLetter(request.getCoverLetter())
                .build();

        applicationRepository.save(application);
        return ResponseEntity.ok(Map.of("message", "Candidature envoyée avec succès", "id", application.getId()));
    }

    @GetMapping("/me")
    @Operation(summary = "Mes candidatures", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<Map<String, Object>>> myApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        List<Map<String, Object>> result = applicationRepository
                .findByApplicantIdOrderByAppliedAtDesc(user.getId())
                .stream()
                .map(app -> Map.<String, Object>of(
                        "id", app.getId(),
                        "jobTitle", app.getJob().getTitle(),
                        "company", app.getJob().getCompany(),
                        "status", app.getStatus().name(),
                        "appliedAt", app.getAppliedAt().toString()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Mettre à jour le statut (recruteur)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody Map<String, String> body,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature introuvable"));

        Application.ApplicationStatus newStatus = Application.ApplicationStatus.valueOf(body.get("status").toUpperCase());
        app.setStatus(newStatus);
        applicationRepository.save(app);

        return ResponseEntity.ok(Map.of("message", "Statut mis à jour", "status", newStatus.name()));
    }

    @Data
    static class ApplyRequest {
        private Long jobId;
        private String coverLetter;
    }
}
