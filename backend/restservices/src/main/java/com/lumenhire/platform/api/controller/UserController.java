package com.lumenhire.platform.api.controller;

import com.lumenhire.platform.api.dto.JwtResponse;
import com.lumenhire.platform.application.service.JwtService;
import com.lumenhire.platform.application.service.ScheduleService;
import com.lumenhire.platform.application.service.UserService;
import com.lumenhire.platform.domain.model.User;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Objects;

@RestController
@RequestMapping(value="/user")
@CrossOrigin(origins = {"http://localhost:3000"})
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    UserService userService;
    @Autowired
    private  Scheduler scheduler;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtService jwtService;
    @GetMapping("/welcome")
    public String welcome()  {
        userService.tr();
        return "Welcome this endpoint is not secure";
    }

    @PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> Register(@RequestBody User user) throws Exception{
             userService.register(user);
             String token=jwtService.generateToken(user.getEmail());
             return ResponseEntity.ok(new JwtResponse(token,jwtService.extractExpiration(token),user.getRole().toString()));
    }
    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> Login(@RequestBody User user) throws Exception {
        authenticate(user.getEmail(),user.getPassword());
        String token=jwtService.generateToken(user.getEmail());
        user=userService.get(user.getEmail());
        return  ResponseEntity.ok(new JwtResponse(token,jwtService.extractExpiration(token),user.getRole().toString()));
    }
    private void authenticate(String username, String password) throws Exception {
        Objects.requireNonNull(username);
        Objects.requireNonNull(password);

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}
