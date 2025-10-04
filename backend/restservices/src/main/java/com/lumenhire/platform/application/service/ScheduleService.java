package com.lumenhire.platform.application.service;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;


public class ScheduleService implements Job {
    @Autowired
    EmailService emailService;


    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        String meetingId = context.getJobDetail().getJobDataMap().getString("meetingId");
        String recruiter = context.getJobDetail().getJobDataMap().getString("recruiter");
        String jobSeeker = context.getJobDetail().getJobDataMap().getString("jobseeker");
        emailService.sendMail(jobSeeker,"getReady","get ready jobseeker");
        emailService.sendMail(recruiter,"getReady","get ready recruiter");



      //  System.out.println("Hello! Quartz job is running - " + System.currentTimeMillis());
    }

}
