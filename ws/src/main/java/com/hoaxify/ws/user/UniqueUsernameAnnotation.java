package com.hoaxify.ws.user;


import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

	@Target({ FIELD}) //annotasyonu nerede kullanacağımızı belirttiğimiz yer
	@Retention(RUNTIME)
	@Constraint(validatedBy = {UniqueUsernameValidator.class }) // Boolean değer dönecek olan validatör classı buraya veriyoruz
	public @interface UniqueUsernameAnnotation {
		
		// Annotasyon için message , groups ve payloadı kullanmayı java bean validation tarafından dayatılmaktadır.Kullanım zorunludur
		
		String message() default "{hoaxify.constraint.username.UniqueUsername.message}";
		
		Class<?>[] groups() default {};
		
		Class<? extends Payload> [] payload() default {};
	
}
