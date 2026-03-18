package com.talentboard.controller;

import com.talentboard.dto.JobDto;
import com.talentboard.entity.Job;
import com.talentboard.entity.User;
import com.talentboard.repository.JobRepository;
import com.talentboard.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs", description = "Gestion des offres d'emploi")
public class JobController {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Lister et rechercher les offres")
    public ResponseEntity<List<JobDto.Response>> getJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String contractType) {

        List<Job> jobs;
        if (keyword != null || location != null || contractType != null) {
            Job.ContractType type = contractType != null ? Job.ContractType.valueOf(contractType) : null;
            jobs = jobRepository.searchJobs(keyword, location, type);
        } else {
            jobs = jobRepository.findByStatusOrderByCreatedAtDesc(Job.JobStatus.OPEN);
        }

        return ResponseEntity.ok(jobs.stream().map(JobDto.Response::from).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'une offre")
    public ResponseEntity<JobDto.Response> getJob(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(job -> ResponseEntity.ok(JobDto.Response.from(job)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Créer une offre (recruteur)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> createJob(@Valid @RequestBody JobDto.CreateRequest request,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        User recruiter = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        if (recruiter.getRole() != User.Role.RECRUITER) {
            return ResponseEntity.status(403).body("Seuls les recruteurs peuvent créer des offres");
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .company(request.getCompany())
                .location(request.getLocation())
                .contractType(request.getContractType())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .salary(request.getSalary())
                .recruiter(recruiter)
                .build();

        return ResponseEntity.ok(JobDto.Response.from(jobRepository.save(job)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une offre", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> deleteJob(@PathVariable Long id,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        Job job = jobRepository.findById(id).orElse(null);
        if (job == null) return ResponseEntity.notFound().build();

        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        if (!job.getRecruiter().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Non autorisé");
        }

        jobRepository.delete(job);
        return ResponseEntity.ok("Offre supprimée");
    }
}
