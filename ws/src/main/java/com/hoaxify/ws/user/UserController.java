package com.hoaxify.ws.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;
import com.hoaxify.ws.shared.GenericResponse;
import com.hoaxify.ws.shared.Views;

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
	
	@GetMapping("/api/1.0/users")
	Page<User> getUsers(Pageable page){
		return	userService.getUsers(page);
		
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