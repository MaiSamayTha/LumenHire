package com.lumenhire.platform.infrastructure.notifications.annotations;

import com.lumenhire.platform.infrastructure.notifications.NotificationTypes;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface Notify {
    NotificationTypes[] notificationTypes();
    boolean mandatory();
}
