package com.hoaxify.ws.shared;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

@Target({ElementType.PARAMETER}) //annotasyonu nerede kullanacağımızı belirttiğimiz yer
@Retention(RUNTIME)
public @interface CurrentUser {

}
