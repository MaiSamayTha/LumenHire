package com.lumenhire.platform.infrastructure.persistence;

import com.lumenhire.platform.domain.model.JobDetails;
import com.lumenhire.platform.domain.model.Recruiter;
import com.lumenhire.platform.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter,String> {
    @Query(value = "SELECT * FROM jobs WHERE STIPEND >= ?1 AND COMPANY_NAME LIKE ?2 ",nativeQuery = true)
    public List<JobDetails> getUsers(Integer stipend,String companyName,Recruiter recruiter);

}
