package com.hoaxify.ws.user;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


import com.hoaxify.ws.shared.GenericResponse;

import error.ApiError;
import jakarta.validation.Valid;

@RestController
public class UserController {

	@Autowired
	UserService userService ; 

	@PostMapping("/api/1.0/users")	
	public GenericResponse createUser(@Valid @RequestBody User user ) {
		
		userService.save(user);
	
		return new GenericResponse("user created");
				
		
	}
	
	// hata mesajlarını api errora dönüştürür
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ApiError handleValidationException(MethodArgumentNotValidException exception) {
		
		ApiError error = new ApiError(400,"Validation Error","/api/1.0/users");
		
		Map<String , String > validationErrors = new HashMap<>();
		
		for( FieldError fieldError  : exception.getBindingResult().getFieldErrors()) {
			validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());		
		}
		
		error.setValidationErrors(validationErrors);
		
		return error;
		
	}
	

}
