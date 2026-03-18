package com.talentboard.dto;

import com.talentboard.entity.Job;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

public class JobDto {

    @Data
    public static class CreateRequest {
        @NotBlank private String title;
        @NotBlank private String company;
        @NotBlank private String location;
        private Job.ContractType contractType;
        @NotBlank private String description;
        private String requirements;
        private String salary;
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String company;
        private String location;
        private String contractType;
        private String description;
        private String requirements;
        private String salary;
        private String status;
        private String recruiterName;
        private int applicationCount;
        private LocalDateTime createdAt;

        public static Response from(Job job) {
            Response r = new Response();
            r.id = job.getId();
            r.title = job.getTitle();
            r.company = job.getCompany();
            r.location = job.getLocation();
            r.contractType = job.getContractType() != null ? job.getContractType().name() : null;
            r.description = job.getDescription();
            r.requirements = job.getRequirements();
            r.salary = job.getSalary();
            r.status = job.getStatus().name();
            if (job.getRecruiter() != null) {
                r.recruiterName = job.getRecruiter().getFirstName() + " " + job.getRecruiter().getLastName();
            }
            r.applicationCount = job.getApplications() != null ? job.getApplications().size() : 0;
            r.createdAt = job.getCreatedAt();
            return r;
        }
    }
}
