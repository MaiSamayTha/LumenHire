package com.lumenhire.platform.application.service;

import com.lumenhire.platform.api.dto.JwtResponse;
import com.lumenhire.platform.domain.model.JobApplications;
import com.lumenhire.platform.domain.model.JobDetails;
import com.lumenhire.platform.domain.model.Jobseeker;
import com.lumenhire.platform.domain.model.Meeting;
import com.lumenhire.platform.domain.model.Status;
import com.lumenhire.platform.infrastructure.persistence.JobApplicationsRepository;
import com.lumenhire.platform.infrastructure.persistence.JobDetailsRepository;
import com.lumenhire.platform.infrastructure.persistence.JobseekerRepository;
import com.lumenhire.platform.infrastructure.persistence.MeetingRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Date;

@Service
public class JobseekerService {

    private static final Logger log = LoggerFactory.getLogger(JobseekerService.class);

    private final JobseekerRepository jobseekerRepository;
    private final JobApplicationsRepository jobApplicationsRepository;
    private final JobDetailsRepository jobDetailsRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final MeetingRepository meetingRepository;

    @Autowired
    public JobseekerService(JobseekerRepository jobseekerRepository,
                            JobApplicationsRepository jobApplicationsRepository,
                            JobDetailsRepository jobDetailsRepository,
                            JwtService jwtService,
                            PasswordEncoder passwordEncoder,
                            MeetingRepository meetingRepository) {
        this.jobseekerRepository = jobseekerRepository;
        this.jobApplicationsRepository = jobApplicationsRepository;
        this.jobDetailsRepository = jobDetailsRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.meetingRepository = meetingRepository;
    }

    public Jobseeker getSelf(Principal principal) {
        return jobseekerRepository.findById(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("Jobseeker profile not found"));
    }

    public Page<Meeting> getMeeting(String userId, Pageable pageable) {
        return meetingRepository.findByCandidate(userId, pageable);
    }

    public JwtResponse addJobseeker(Jobseeker jobseeker) throws Exception {
        if (jobseekerRepository.findById(jobseeker.getEmail()).isPresent()) {
            throw new BadRequestException("User already exists");
        }
        jobseeker.setPassword(passwordEncoder.encode(jobseeker.getPassword()));
        jobseekerRepository.save(jobseeker);
        return new JwtResponse(jwtService.generateToken(jobseeker.getEmail()), new Date(), jobseeker.getRole().toString());
    }

    public Page<JobApplications> savedJobs(String jobseekerId, Pageable pageable) {
        return jobApplicationsRepository.findByJobAndJobseekerAndSaved(jobseekerId, pageable);
    }

    public Page<JobApplications> appliedJobs(String jobseekerId, Pageable pageable) {
        return jobApplicationsRepository.findByJobAndJobseekerAndApplied(jobseekerId, pageable);
    }

    public JobApplications addJobApplication(String jobseekerId, int jobId) throws Exception {
        Jobseeker jobseeker = jobseekerRepository.findById(jobseekerId)
                .orElseThrow(() -> new BadRequestException("Jobseeker not found"));
        JobDetails jobDetails = jobDetailsRepository.findById(jobId)
                .orElseThrow(() -> new BadRequestException("Job not found"));

        JobApplications jobApplication = jobApplicationsRepository.findByJobAndJobseeker(jobseekerId, jobId)
                .orElseGet(JobApplications::new);

        jobApplication.setJob(jobDetails);
        jobApplication.setJobseeker(jobseeker);
        jobApplication.setApplicationStatus(Status.applied);
        jobApplication.setAppliedOn(LocalDate.now());
        jobApplication.setScore(AtsService.calculateATSScore(jobseeker.getResume(), jobDetails.getJobDescription()));

        return jobApplicationsRepository.save(jobApplication);
    }

    public JobApplications saveJobApplication(String jobseekerId, int jobId) throws Exception {
        Jobseeker jobseeker = jobseekerRepository.findById(jobseekerId)
                .orElseThrow(() -> new BadRequestException("Jobseeker not found"));
        JobDetails jobDetails = jobDetailsRepository.findById(jobId)
                .orElseThrow(() -> new BadRequestException("Job not found"));

        JobApplications jobApplication = jobApplicationsRepository.findByJobAndJobseeker(jobseekerId, jobId)
                .orElseGet(() -> {
                    JobApplications fresh = new JobApplications();
                    fresh.setJob(jobDetails);
                    fresh.setJobseeker(jobseeker);
                    fresh.setApplicationStatus(Status.applied);
                    fresh.setAppliedOn(LocalDate.now());
                    return fresh;
                });

        jobApplication.setSaved(!jobApplication.isSaved());
        return jobApplicationsRepository.save(jobApplication);
    }

    public Page<JobApplications> getJobApplications(String jobseekerId, Pageable pageable) {
        return jobApplicationsRepository.findByJobAndJobseekerAndApplied(jobseekerId, pageable);
    }

    public Page<JobDetails> getJobs(Pageable pageable) {
        return jobDetailsRepository.findFilteredJobs(pageable);
    }

    public void updateResume(String jobseekerId, byte[] resume) throws Exception {
        Jobseeker jobseeker = jobseekerRepository.findById(jobseekerId)
                .orElseThrow(() -> new BadRequestException("Jobseeker not found"));
        jobseeker.setResume(resume);
        jobseekerRepository.save(jobseeker);
    }
}
