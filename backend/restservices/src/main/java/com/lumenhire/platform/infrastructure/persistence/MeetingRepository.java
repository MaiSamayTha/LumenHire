package com.lumenhire.platform.infrastructure.persistence;

import com.lumenhire.platform.domain.model.JobApplications;
import com.lumenhire.platform.domain.model.Meeting;
import com.lumenhire.platform.domain.model.Recruiter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting,Long> {
    @Query(value="SELECT * FROM meeting WHERE JOB=?1 AND CANDIDATE IS NOT NULL ",nativeQuery = true)
    public Page<Meeting> findByJob(int job, Pageable pageable);
    @Query(value="SELECT * FROM meeting WHERE CANDIDATE=?1 ",nativeQuery = true)
    public Page<Meeting>findByCandidate(String candidate,Pageable pageable);
    @Query(value="SELECT TIME FROM meeting WHERE JOB=?1 AND APPLIED=false AND TIME IS NOT NULL",nativeQuery = true)
    public List<Timestamp> findAvailaible(int job);
    @Query(value="SELECT COUNT(*) as total FROM meeting WHERE RECRUITER_ID IS NOT NULL AND RECRUITER_ID=?2 AND TIME IS NOT NULL AND \n"
    +"NOT((TIME + INTERVAL 90 MINUTE < ?1) OR (?1 + INTERVAL 90 MINUTE < TIME )) AND APPLIED=true",nativeQuery = true)
    public Long findConflict(LocalDateTime startTime, String  recruiter);
    @Query(value="SELECT *  FROM meeting WHERE RECRUITER_ID IS NOT NULL AND RECRUITER_ID=?2 AND TIME IS NOT NULL AND \n"
            +"TIME BETWEEN (?1 - INTERVAL 1 SECOND) AND (?1 + INTERVAL 1 SECOND) AND APPLIED=false",nativeQuery = true)
    public Meeting findMeeting(LocalDateTime startTime, String  recruiter);
    @Query(value="SELECT COUNT(*) as total FROM meeting WHERE RECRUITER_ID IS NOT NULL AND RECRUITER_ID=?2 AND TIME IS NOT NULL AND \n"
            +"NOT((TIME + INTERVAL 90 MINUTE < ?1) OR (?1 + INTERVAL 90 MINUTE < TIME )) ",nativeQuery = true)
    public Long findAllConflict(LocalDateTime startTime, String  recruiter);
    @Query(value="SELECT * FROM meeting WHERE RECRUITER_ID IS NOT NULL AND RECRUITER_ID=?1 AND CANDIDATE IS NOT NULL AND TIME IS NOT NULL",nativeQuery = true)
    public Page<Meeting> getMeetingByRecruiter(String recruiter,Pageable pageable);
    @Modifying
    @Transactional
    @Query(value="DELETE FROM meeting\n" +
            "WHERE TIME IS NOT  NULL AND TIME < NOW();",nativeQuery = true)
    public  void removeUselessMeet();
    @Query(value="SELECT * FROM meeting WHERE JOB=?2 AND CANDIDATE=?1 LIMIT 1",nativeQuery = true)
    public Meeting findByJobAndJobseeker(String candidate,int job);


}
