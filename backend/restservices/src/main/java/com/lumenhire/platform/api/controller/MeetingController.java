package com.lumenhire.platform.api.controller;

import com.lumenhire.platform.domain.model.JobDetails;
import com.lumenhire.platform.domain.model.Meeting;
import com.lumenhire.platform.domain.model.MeetingRequest;
import com.lumenhire.platform.application.service.MeetingService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;

@RestController
@RequestMapping(value="/meeting")
public class MeetingController {
    @Autowired
    private MeetingService meetingService;


    @PostMapping("/welcome")
    public ResponseEntity<?>welcome(@RequestBody Meeting meeting, Principal principal) throws Exception {

        return ResponseEntity.ok(meetingService.addMeeting(meeting,principal.getName()));
    }
    @GetMapping ("/recruiter/{jobId}")
    public ResponseEntity<?> meetingTiming(@PathVariable Integer jobId){
        return ResponseEntity.ok(meetingService.meetingTime(jobId));
    }

//    @PostMapping("/selection")
//    public ResponseEntity<?>selection(@RequestBody  Meeting meeting,Principal principal) throws MessagingException {
//        return ResponseEntity.ok(meetingService.selectCandidate(meeting,principal.getName()));
//    }
    @PostMapping("/addMeeting")
    public ResponseEntity<?>addMeeting(@RequestBody Meeting meeting, Principal principal) throws Exception {

        return ResponseEntity.ok(meetingService.addMeeting(meeting,principal.getName()));
    }

    @PostMapping("/finalise")
    public ResponseEntity<?>finaliseMeet(@RequestBody Meeting meeting,Principal principal) throws Exception {
        return ResponseEntity.ok(meetingService.finalise(meeting, principal.getName()));
    }
}
