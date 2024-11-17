package com.hoaxify.ws.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.shared.GenericResponse;
import com.hoaxify.ws.user.vm.UserUpdateVM;
import com.hoaxify.ws.user.vm.UserVM;

import error.ApiError;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/1.0")
public class UserController {

	@Autowired
	UserService userService ; 

	@PostMapping("/users")	
	public GenericResponse createUser(@Valid @RequestBody User user ) {	
		userService.save(user);
		return new GenericResponse("user created");					
	}
	
	
	@GetMapping("/users")
	Page<UserVM> getUsers(Pageable page, @CurrentUserAnnotation User user){
		return userService.getUsers(page, user).map(UserVM::new);
	}
	
	@GetMapping("/users/{username}")
	UserVM getUser(@PathVariable String username) {
     	User user = userService.getByUsername(username);
     	return new UserVM(user);
	}
	
	
	@PutMapping("/users/{username}")
	@PreAuthorize("#username == principal.username")
	UserVM updateUser(@Valid @RequestBody UserUpdateVM updatedUser, @PathVariable String username) {
		User user = userService.updateUser(username, updatedUser);
		return new UserVM(user);

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