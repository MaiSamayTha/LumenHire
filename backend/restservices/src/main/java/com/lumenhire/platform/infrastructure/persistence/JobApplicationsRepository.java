package com.lumenhire.platform.infrastructure.persistence;

import com.lumenhire.platform.domain.model.JobApplications;
import com.lumenhire.platform.domain.model.JobDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobApplicationsRepository extends JpaRepository<JobApplications,Integer> {

    @Query(nativeQuery = true,value="SELECT * FROM job_applications WHERE JOB_ID=?1 AND APPLICATION_STATUS IS NOT NULL AND APPLICATION_STATUS != 'Rejected'  ")
    public Page<JobApplications> findByJob(int job,Pageable pageable);
    @Query(nativeQuery = true,value="SELECT * FROM job_applications WHERE JOBSEEKER_ID=?1 AND JOB_ID=?2 ")
    public Optional<JobApplications> findByJobAndJobseeker(String  jobseekerId,int jobDetailsId);
    @Query(nativeQuery = true,value="SELECT * FROM job_applications WHERE JOBSEEKER_ID=?1  AND IS_SAVED = true")
    public Page<JobApplications> findByJobAndJobseekerAndSaved(String  jobseekerId,Pageable pageable);
    @Query(nativeQuery = true,value="SELECT * FROM job_applications WHERE JOBSEEKER_ID=?1  AND APPLICATION_STATUS IS NOT NULL ")
    public Page<JobApplications> findByJobAndJobseekerAndApplied(String  jobseekerId,Pageable pageable);
    @Query(nativeQuery = true,value="SELECT * FROM job_applications WHERE JOB_ID=?1  AND APPLICATION_STATUS IS NOT NULL ")
    public Page<JobApplications> findByJob(String jobId,Pageable pageable);
}
