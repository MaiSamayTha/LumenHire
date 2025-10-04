package com.lumenhire.platform.infrastructure.persistence;

import com.lumenhire.platform.domain.model.Jobseeker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobseekerRepository extends JpaRepository<Jobseeker,String> {
}
