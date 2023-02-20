package com.hoaxify.ws.user;

import org.springframework.beans.factory.annotation.Autowired;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername,String>{

	// db bağlantısı
	@Autowired
	UserRepository userRepository ;
	
	
	@Override
	public boolean isValid(String username, ConstraintValidatorContext context) {

		User user = userRepository.findByUsername(username);	

		if(user != null) {
			return false;		
		}	
		return true ;
	}

}
