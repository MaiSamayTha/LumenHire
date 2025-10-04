package com.lumenhire.platform.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "recruiter")
public class Recruiter extends User {

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @JsonBackReference("recruiter-jobs")
    @OneToMany(mappedBy = "recruiter", cascade = CascadeType.ALL)
    private List<JobDetails> jobs = new ArrayList<>();

    @Column(name = "current_position")
    private String currentPosition;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recruiter_focus", joinColumns = @JoinColumn(name = "recruiter_email"))
    @Column(name = "focus_area")
    private List<String> skills = new ArrayList<>();

    @Column(name = "linkedein_profile")
    private String linkedein;

    protected Recruiter() {
    }

    public Recruiter(User seed) {
        super(seed.getEmail(), seed.getName(), seed.getPassword(), seed.getRole());
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public List<JobDetails> getJobs() {
        return jobs;
    }

    public void setJobs(List<JobDetails> jobs) {
        this.jobs = jobs;
    }

    public String getCurrentPosition() {
        return currentPosition;
    }

    public void setCurrentPosition(String currentPosition) {
        this.currentPosition = currentPosition;
    }

    public List<String> getSkills() {
        return Collections.unmodifiableList(skills);
    }

    public void setSkills(List<String> skills) {
        this.skills = new ArrayList<>(skills);
    }

    public String getLinkedein() {
        return linkedein;
    }

    public void setLinkedein(String linkedein) {
        this.linkedein = linkedein;
    }
}