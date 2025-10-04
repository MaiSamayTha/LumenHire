package com.lumenhire.platform.infrastructure.persistence;

import com.lumenhire.platform.domain.model.JobDetails;
import com.lumenhire.platform.domain.model.Jobseeker;
import com.lumenhire.platform.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface JobDetailsRepository extends JpaRepository<JobDetails,Integer> {
    Optional<JobDetails> findById(int user_id);
    @Query(nativeQuery = true,value="SELECT * FROM job ")
    public Page<JobDetails> findFilteredJobs(  Pageable pageable);
    @Query(nativeQuery = true,value="SELECT * FROM job WHERE RECRUITER_ID=?1")
    public Page<JobDetails>findByRecruiter(String recruiter,Pageable pageable);
}
