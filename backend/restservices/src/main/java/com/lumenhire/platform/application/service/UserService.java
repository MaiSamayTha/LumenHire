package com.lumenhire.platform.application.service;

import com.lumenhire.platform.infrastructure.persistence.UserRepository;
import com.lumenhire.platform.domain.model.User;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    public User register(User user) throws Exception{
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
         throw new BadRequestException("User already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    public User get(String userId) {
        return userRepository.findByEmail(userId).get();
    }
    public Long tr(){
        return userRepository.count();
    }

}
