package com.lumenhire.platform.domain.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "JOBSEEKER")
public class Jobseeker extends User {

    @Lob
    @Column(length = 5242880)
    private byte[] resume;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "jobseeker_skills", joinColumns = @JoinColumn(name = "jobseeker_email"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    protected Jobseeker() {
    }

    public Jobseeker(User seed) {
        super(seed.getEmail(), seed.getName(), seed.getPassword(), seed.getRole());
    }

    public byte[] getResume() {
        return resume;
    }

    public void setResume(byte[] resume) {
        this.resume = resume;
    }

    public List<String> getSkills() {
        return Collections.unmodifiableList(skills);
    }

    public void setSkills(List<String> skills) {
        this.skills = new ArrayList<>(skills);
    }

    public void addSkill(String skill) {
        if (skill != null && !skill.isBlank()) {
            this.skills.add(skill.trim());
        }
    }
}