package com.lumenhire.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(scanBasePackages = "com.lumenhire.platform")
public class LumenhirePlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(LumenhirePlatformApplication.class, args);
    }
}
