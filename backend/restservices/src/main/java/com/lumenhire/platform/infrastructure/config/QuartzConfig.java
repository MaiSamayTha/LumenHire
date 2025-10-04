package com.lumenhire.platform.infrastructure.config;
import org.quartz.Scheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.quartz.SchedulerFactory;
@Configuration
public class QuartzConfig {
    @Autowired
    private Scheduler scheduler;

    @Bean
    public Scheduler scheduler() throws Exception {

        return scheduler;
    }

}
