package com.talentboard;

import com.talentboard.entity.Job;
import com.talentboard.entity.User;
import com.talentboard.repository.JobRepository;
import com.talentboard.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class TalentBoardRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    private User recruiter;

    @BeforeEach
    void setUp() {
        recruiter = userRepository.save(User.builder()
                .email("recruiter@test.com")
                .password("encoded_password")
                .firstName("Alice")
                .lastName("Martin")
                .role(User.Role.RECRUITER)
                .build());
    }

    @Test
    void shouldFindUserByEmail() {
        Optional<User> found = userRepository.findByEmail("recruiter@test.com");
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("Alice");
    }

    @Test
    void shouldReturnTrueWhenEmailExists() {
        assertThat(userRepository.existsByEmail("recruiter@test.com")).isTrue();
        assertThat(userRepository.existsByEmail("unknown@test.com")).isFalse();
    }

    @Test
    void shouldSaveAndRetrieveJob() {
        Job job = jobRepository.save(Job.builder()
                .title("Développeur Java")
                .company("TechCorp")
                .location("Paris")
                .contractType(Job.ContractType.CDI)
                .description("Poste de développeur senior")
                .recruiter(recruiter)
                .build());

        Optional<Job> found = jobRepository.findById(job.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Développeur Java");
    }

    @Test
    void shouldFindOpenJobsOnly() {
        jobRepository.save(Job.builder()
                .title("Poste ouvert").company("A").location("Lyon")
                .description("Desc").status(Job.JobStatus.OPEN).recruiter(recruiter).build());

        jobRepository.save(Job.builder()
                .title("Poste fermé").company("B").location("Lyon")
                .description("Desc").status(Job.JobStatus.CLOSED).recruiter(recruiter).build());

        List<Job> openJobs = jobRepository.findByStatusOrderByCreatedAtDesc(Job.JobStatus.OPEN);
        assertThat(openJobs).hasSize(1);
        assertThat(openJobs.get(0).getTitle()).isEqualTo("Poste ouvert");
    }

    @Test
    void shouldSearchJobsByKeyword() {
        jobRepository.save(Job.builder()
                .title("Ingénieur DevOps").company("CloudCo").location("Remote")
                .description("CI/CD expert").recruiter(recruiter).build());

        jobRepository.save(Job.builder()
                .title("Data Scientist").company("DataCo").location("Paris")
                .description("ML expert").recruiter(recruiter).build());

        List<Job> results = jobRepository.searchJobs("DevOps", null, null);
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).contains("DevOps");
    }
}
