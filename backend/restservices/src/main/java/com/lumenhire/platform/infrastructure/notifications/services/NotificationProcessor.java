package com.lumenhire.platform.infrastructure.notifications.services;

import com.lumenhire.platform.infrastructure.notifications.annotations.Notify;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Aspect
@Component
public class NotificationProcessor {
    @Transactional
    @Before(value = "@annotation(com.lumenhire.platform.infrastructure.notifications.annotations.Notify)")
    public void processBeforeNotification(JoinPoint joinPoint){
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Class<?> claz = methodSignature.getMethod().getDeclaringClass();
        String className = claz.getSimpleName();
        String methodName = methodSignature.getName();
        Notify notify = methodSignature.getMethod().getAnnotation(Notify.class);

    }
    @AfterReturning(value = "@annotation(com.darkeyescan.tip.scan.notifications.annotations.Notify)", returning = "returnObject")
    public void processNotifications(JoinPoint joinPoint, Object returnObject){

    }
}
