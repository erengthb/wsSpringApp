package com.hoaxify.ws.user;

import org.slf4j.Logger;

import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

	private static final Logger Log = LoggerFactory.getLogger(UserController.class);
	
	@PostMapping("/api/1.0/users")
	public void createUser(@RequestBody User user) {
		
		Log.info(user.toString());
		
		
	}
	
}
