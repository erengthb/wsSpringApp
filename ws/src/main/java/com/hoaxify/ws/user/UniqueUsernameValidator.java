package com.hoaxify.ws.user;

import org.springframework.beans.factory.annotation.Autowired;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername,String>{

	@Autowired
	UserRepository userRepository ;
	
	
	@Override
	public boolean isValid(String username, ConstraintValidatorContext context) {

		boolean result = false ;
		
		User user = userRepository.findByUsername(username);	

		if(user != null) {			
			return result;		
		} 
		else
		{
			result = true;
			return result;
		}
		
	}

}
