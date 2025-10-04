package com.lumenhire.platform.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "job_applications")
public class JobApplications {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private JobDetails job;

    @ManyToOne
    @JoinColumn(name = "jobseeker_id", nullable = false)
    private Jobseeker jobseeker;

    @Enumerated(EnumType.STRING)
    @Column(name = "application_status")
    private Status applicationStatus;

    @Column(name = "is_saved")
    private boolean saved;

    @Column(name = "applied_on")
    private LocalDate appliedOn;

    @Column(name = "recruiter_application_status")
    private String recruiterApplicationStatus;

    @Column(name = "score")
    private Double score;

    public Long getId() {
        return id;
    }

    public JobDetails getJob() {
        return job;
    }

    public void setJob(JobDetails job) {
        this.job = job;
    }

    public Jobseeker getJobseeker() {
        return jobseeker;
    }

    public void setJobseeker(Jobseeker jobseeker) {
        this.jobseeker = jobseeker;
    }

    public Status getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(Status applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    public boolean isSaved() {
        return saved;
    }

    public void setSaved(boolean saved) {
        this.saved = saved;
    }

    public LocalDate getAppliedOn() {
        return appliedOn;
    }

    public void setAppliedOn(LocalDate appliedOn) {
        this.appliedOn = appliedOn;
    }

    public String getRecruiterApplicationStatus() {
        return recruiterApplicationStatus;
    }

    public void setRecruiterApplicationStatus(String recruiterApplicationStatus) {
        this.recruiterApplicationStatus = recruiterApplicationStatus;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }
}