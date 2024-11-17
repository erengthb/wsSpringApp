package com.hoaxify.ws.shared;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ FIELD }) // annotasyonu nerede kullanacağımızı belirttiğimiz yer
@Retention(RUNTIME)
@Constraint(validatedBy = { ProfileImageValidator.class }) // Boolean değer dönecek olan validatör classı buraya
															// veriyoruz
public @interface ProfileImage {

	// Annotasyon için message , groups ve payloadı kullanmayı java bean validation
	// tarafından dayatılmaktadır.Kullanım zorunludur

	String message() default "{hoaxify.constraint.ProfileImage.message}";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}
