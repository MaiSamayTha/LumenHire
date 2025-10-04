package com.lumenhire.platform.application.service;

import com.lumenhire.platform.domain.model.*;
import com.lumenhire.platform.infrastructure.persistence.JobApplicationsRepository;
import com.lumenhire.platform.infrastructure.persistence.JobDetailsRepository;
import com.lumenhire.platform.infrastructure.persistence.MeetingRepository;
import com.lumenhire.platform.infrastructure.persistence.RecruiterRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.apache.coyote.BadRequestException;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Timestamp;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class MeetingService {
    private static final Logger log = LoggerFactory.getLogger(MeetingService.class);
    @Autowired
    private Scheduler scheduler;
    @Autowired
    ZoomTokenService zoomTokenService;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private RecruiterRepository recruiterRepository;
    @Autowired
    private JobApplicationsRepository jobApplicationsRepository;
    @Autowired
    private MeetingRepository meetingRepository;
    @Autowired
    private JobDetailsRepository jobDetailsRepository;
    @Value("${spring.server}")
    private  String url;
    private final RestTemplate restTemplate = new RestTemplate();
    @Scheduled(cron = "0 14 13 * * ?", zone = "Asia/Kolkata")
    private void runDailyJob() {
        log.info("Deleting old meetings");
        meetingRepository.removeUselessMeet();
    }
    @Scheduled(fixedRate = 5*60*1000)
    public void ping(){
        try{
            String surl=url+"/user/welcome";
            String response = restTemplate.getForObject(surl, String.class);
            System.out.println("Self-ping response: " + response);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    private String createMeeting(String topic, String startTimeUTC, int durationMinutes) throws Exception {
        String token = zoomTokenService.getAccessToken();

        String body = """
        {
          "topic": "%s",
          "type": 2,
          "start_time": "%s",
          "duration": %d,
          "timezone": "UTC"
        }
        """.formatted(topic, startTimeUTC, durationMinutes);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.zoom.us/v2/users/me/meetings"))
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = mapper.readTree(response.body());
        log.info(node.toString());
        return node.get("join_url").asText();
    }
    public String scheduleMeet(String topic, String startTimeUTC, int durationMinutes,String mail1,String mail2) throws Exception{
        String location="online";
        LocalDateTime localDateTime = LocalDateTime.parse(startTimeUTC);
        OffsetDateTime startTime = localDateTime.atOffset(ZoneOffset.UTC);
        OffsetDateTime endTime = startTime.plusMinutes(durationMinutes);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'")
                .withZone(ZoneOffset.UTC);
        String endTimeUTC = formatter.format(endTime);
        startTimeUTC=formatter.format(startTime);
        String description="invited for interview";
        String summary=createMeeting("interview",startTimeUTC,durationMinutes);

       String ics=generateIcs(topic,description,startTimeUTC,endTimeUTC,location);
       log.info("ics {} endTime {} startTime{} summary{}",ics,endTimeUTC,startTimeUTC,summary);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(mail1);
        helper.setSubject(description);
        helper.setText("Please find your Zoom meeting calendar invite attached.  "+summary);
        helper.addAttachment("meeting.ics", new ByteArrayResource(ics.getBytes()), "text/calendar");
        mailSender.send(message);
        helper.setTo(mail2);
        mailSender.send(message);
        return summary;
    }
    private String generateIcs(String summary, String description, String startTime, String endTime, String location){
        return(
                "BEGIN:VCALENDAR\r\n" +
                                     "VERSION:2.0\r\n" +
                                     "PRODID:-//Your Company//Meeting Scheduler//EN\r\n" +
                                     "CALSCALE:GREGORIAN\r\n" +
                                     "METHOD:REQUEST\r\n" +
                                     "BEGIN:VEVENT\r\n" +
                                     "UID:" + UUID.randomUUID() + "\r\n" +
                                     "DTSTAMP:" + formatICSTime(LocalDateTime.now()) + "\r\n" +
                                     "DTSTART:" + startTime + "\r\n" +
                                     "DTEND:" + endTime + "\r\n" +
                                     "SUMMARY:" + summary + "\r\n" +
                                     "DESCRIPTION:" + description + "\r\n" +
                                     "LOCATION:" + location + "\r\n" +
                                     "STATUS:CONFIRMED\r\n" +
                                     "SEQUENCE:0\r\n" +
                                     "END:VEVENT\r\n" +
                                     "END:VCALENDAR"
        );

    }
    public Page<Meeting> getMeetingByJob(int jobId,Pageable pageable){
        return meetingRepository.findByJob(jobId,pageable);
    }
    public String finalise(Meeting meeting,String candidate) throws Exception {
        meeting.setCandidate(candidate);
        JobDetails jobDetails=jobDetailsRepository.findById(meeting.getJob()).get();
        meeting.setRecruiter(jobDetails.getRecruiter());
        Recruiter recruiter=meeting.getRecruiter();

       Long flag= meetingRepository.findConflict(meeting.getTime(),recruiter.getEmail());
        if(flag>0)
            return "slot filled";
        else{
            ZoneId istZone = ZoneId.of("Asia/Kolkata");
            ZonedDateTime zonedIST = meeting.getTime().atZone(istZone);
            ZonedDateTime zonedUTC = zonedIST.withZoneSameInstant(ZoneOffset.UTC);
            LocalDateTime utcDateTime = zonedUTC.toLocalDateTime();
            Meeting meeting1=meetingRepository.findMeeting(meeting.getTime(),recruiter.getEmail());
            Meeting meeting2=meetingRepository.findByJobAndJobseeker(candidate,jobDetails.getId());
            meetingRepository.deleteById(meeting1.getId());

            meeting2.setApplied(true);

            String link=scheduleMeet("create the meeting",utcDateTime.toString(),90,meeting.getCandidate(),meeting.getRecruiter().getEmail());
            meeting2.setCandidate(meeting.getCandidate());
            meeting2.setZoomLink(link);
            meeting2.setTime(meeting1.getTime());

            meetingRepository.save(meeting2);
            JobDetail jobDetail = JobBuilder.newJob(ScheduleService.class)
                    .withIdentity("meetingJob-" +meeting2.getZoomLink(), "meetings")
                    .usingJobData("recruiter", recruiter.getEmail())
                    .usingJobData("jobseeker",candidate)
                    .build();
            Trigger trigger = TriggerBuilder.newTrigger()
                    .withIdentity("meetingTrigger-" + meeting1.getZoomLink(), "meetings") // unique name in "meetings" group
                    .startAt(Date.from(utcDateTime.minusHours(1).toInstant(ZoneOffset.UTC)))         // start 1 hour before utcDateTime
                    .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                            .withMisfireHandlingInstructionFireNow())                  // if missed, fire immediately
                    .build();


            scheduler.scheduleJob(jobDetail, trigger);
            JobApplications jobApplications=jobApplicationsRepository.findByJobAndJobseeker(meeting.getCandidate(), meeting.getJob()).get();




            return "slot applied";
        }
    }
    public List<LocalDateTime> meetingTime(Integer jobId){
        return meetingRepository.findAvailaible(jobId).stream()
                .map(Timestamp::toLocalDateTime)
                .toList();
    }
    public String finalCommunication(Meeting meeting,String status,String content ) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(meeting.getCandidate());
        if(status.equals( Status.Rejected.toString()))
        {
            helper.setSubject("You have been Rejected");
        }
        else{
            helper.setSubject("Congrats Selected");
        }
        helper.setText(content);
        mailSender.send(message);
        return "ok";
    }
    public String selectCandidate(Meeting meeting,String interviewer,String note,Integer applicationId) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setSubject("Congrats Interview");
        helper.setTo(meeting.getCandidate());
        helper.setText(note);
        Recruiter recruiter=recruiterRepository.findById(interviewer).get();
        meeting.setRecruiter(recruiter);
        meeting.setJobApplications(jobApplicationsRepository.findById(applicationId).get());
        meetingRepository.save(meeting);
        mailSender.send(message);
        return "ok";
    }

    public Meeting addMeeting(Meeting meeting,String interviewer) throws Exception{

       Recruiter recruiter= recruiterRepository.findById(interviewer).get();
       meeting.setRecruiter(recruiter);
       if(meeting.getJob()==0)
           throw  new ResponseStatusException(HttpStatus.BAD_REQUEST, "no Job");
       if(meetingRepository.findAllConflict(meeting.getTime(),meeting.getRecruiter().getEmail())>0)
        throw  new ResponseStatusException(HttpStatus.BAD_REQUEST, "Overlapping schedule");
       meetingRepository.save(meeting);
       return meeting;
    }
    private String formatICSTime(LocalDateTime time) {
        return time.format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'"));
    }

}


