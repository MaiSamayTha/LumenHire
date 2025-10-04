package com.lumenhire.platform.application.service;

import com.lumenhire.platform.api.dto.JwtResponse;
import com.lumenhire.platform.domain.model.JobApplications;
import com.lumenhire.platform.domain.model.JobDetails;
import com.lumenhire.platform.domain.model.Meeting;
import com.lumenhire.platform.domain.model.Recruiter;
import com.lumenhire.platform.domain.model.Status;
import com.lumenhire.platform.infrastructure.persistence.JobApplicationsRepository;
import com.lumenhire.platform.infrastructure.persistence.JobDetailsRepository;
import com.lumenhire.platform.infrastructure.persistence.MeetingRepository;
import com.lumenhire.platform.infrastructure.persistence.RecruiterRepository;
import jakarta.mail.MessagingException;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RecruiterService {

    private static final Logger log = LoggerFactory.getLogger(RecruiterService.class);

    private final RecruiterRepository recruiterRepository;
    private final JobDetailsRepository jobDetailsRepository;
    private final JobApplicationsRepository jobApplicationsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MeetingRepository meetingRepository;
    private final MeetingService meetingService;

    @Autowired
    public RecruiterService(RecruiterRepository recruiterRepository,
                            JobDetailsRepository jobDetailsRepository,
                            JobApplicationsRepository jobApplicationsRepository,
                            PasswordEncoder passwordEncoder,
                            JwtService jwtService,
                            MeetingRepository meetingRepository,
                            MeetingService meetingService) {
        this.recruiterRepository = recruiterRepository;
        this.jobDetailsRepository = jobDetailsRepository;
        this.jobApplicationsRepository = jobApplicationsRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.meetingRepository = meetingRepository;
        this.meetingService = meetingService;
    }

    public Recruiter getSelf(Principal principal) {
        return recruiterRepository.findById(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found for " + principal.getName()));
    }

    public JwtResponse addRecruiter(Recruiter recruiter) throws Exception {
        recruiter.setPassword(passwordEncoder.encode(recruiter.getPassword()));
        recruiterRepository.save(recruiter);
        return new JwtResponse(jwtService.generateToken(recruiter.getEmail()), new Date(), recruiter.getRole().toString());
    }

    public JobDetails addJob(JobDetails jobDetails, String recruiterId) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter not found: " + recruiterId));
        jobDetails.setRecruiter(recruiter);
        return jobDetailsRepository.save(jobDetails);
    }

    public List<JobDetails> getJobs(String recruiterId) {
        return recruiterRepository.findById(recruiterId)
                .map(Recruiter::getJobs)
                .orElse(List.of());
    }

    public Page<JobDetails> getJobs(String recruiterId, Pageable pageable) {
        return jobDetailsRepository.findByRecruiter(recruiterId, pageable);
    }

    public JobApplications changeJobStatus(String interviewChannel,
                                           Meeting meeting,
                                           Integer jobApplicationId,
                                           String status,
                                           String note) throws BadRequestException, MessagingException {
        JobApplications jobApplication = jobApplicationsRepository.findById(jobApplicationId)
                .orElseThrow(() -> new BadRequestException("Job application not found"));

        Status targetStatus = Status.valueOf(status);
        switch (targetStatus) {
            case NextRound -> {
                meetingService.selectCandidate(meeting, interviewChannel, note, jobApplicationId);
            }
            case Rejected -> {
                meetingService.finalCommunication(meeting, status, note);
                jobApplication.setApplicationStatus(Status.Rejected);
            }
            case Selected -> {
                meetingService.finalCommunication(meeting, status, note);
                jobApplication.setApplicationStatus(Status.Selected);
            }
            default -> throw new BadRequestException("Unsupported status transition");
        }

        return jobApplicationsRepository.save(jobApplication);
    }

    public Page<JobApplications> getApplications(int jobId, Pageable pageable) {
        return jobApplicationsRepository.findByJob(jobId, pageable);
    }

    public Page<Meeting> getMeeting(String recruiterId, Pageable pageable) {
        return meetingRepository.getMeetingByRecruiter(recruiterId, pageable);
    }
}