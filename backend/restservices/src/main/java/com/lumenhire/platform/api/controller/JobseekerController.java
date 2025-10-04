package com.lumenhire.platform.api.controller;

import com.lumenhire.platform.domain.model.JobApplications;
import com.lumenhire.platform.domain.model.JobDetails;
import com.lumenhire.platform.domain.model.Jobseeker;
import com.lumenhire.platform.domain.model.User;
import com.lumenhire.platform.application.service.JobseekerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping(value="/jobseeker")
public class JobseekerController {
    @Autowired
    JobseekerService jobseekerService;
    @GetMapping(path="/self",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> self(Principal principal){
        return ResponseEntity.ok(jobseekerService.getSelf(principal));
    }
    @GetMapping(path="/meeting",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> meetings(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "3") int size,
                                      @RequestParam(defaultValue = "id") String sortBy,
                                        Principal principal){
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return ResponseEntity.ok(jobseekerService.getMeeting(principal.getName(), pageable));
    }
    @PostMapping(path = "/register",consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> register(@RequestBody User user) throws Exception
    {

        Jobseeker jobseeker= new Jobseeker(user);
        return ResponseEntity.ok(jobseekerService.addJobseeker(jobseeker));
    }
    @GetMapping(path="/getApplications",produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<JobApplications> getJobs(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "3") int size,
                                         @RequestParam(defaultValue = "id") String sortBy,
                                         Principal principal)

     {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return  jobseekerService.getJobApplications(principal.getName(),pageable);
    }
    @GetMapping(path="/getJobs",produces = MediaType.APPLICATION_JSON_VALUE)
    public  Page<JobDetails> getApplications(@RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "3") int size,
                                             @RequestParam(defaultValue = "id") String sortBy
                                             )
    {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return jobseekerService.getJobs(pageable);
    }
    @GetMapping(path="/applyJob",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> applyJob(@RequestParam(required = true) int jobId,
                                      Principal principal) throws Exception {

        return ResponseEntity.ok(jobseekerService.addJobApplication(principal.getName(),jobId));
    }
    @GetMapping(path="/saveJob",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveJob(@RequestParam(required = true) int jobId,Principal principal) throws  Exception{
       return ResponseEntity.ok(jobseekerService.saveJobApplication(principal.getName(),jobId));
    }
    @GetMapping(path="/getSavedJobs",produces = MediaType.APPLICATION_JSON_VALUE)
    public  Page<JobApplications> getSavedJobs(@RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "3") int size,
                                             @RequestParam(defaultValue = "id") String sortBy,
                                             Principal principal)
    {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return jobseekerService.savedJobs(principal.getName(),pageable);
    }
    @GetMapping(path="/appliedJobs",produces = MediaType.APPLICATION_JSON_VALUE)
    public  Page<JobApplications> getAppliedJobs(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "3") int size,
                                                 @RequestParam(defaultValue = "id") String sortBy,
                                                 Principal principal)
    {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return jobseekerService.appliedJobs(principal.getName(),pageable);
    }
    @PostMapping(path = "/resume",consumes = MediaType.MULTIPART_FORM_DATA_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadResume(@RequestParam("resume") MultipartFile resume, Principal principal) throws Exception {
        jobseekerService.updateResume(principal.getName(),resume.getBytes());

        return ResponseEntity.ok(principal.getName());
    }
}
