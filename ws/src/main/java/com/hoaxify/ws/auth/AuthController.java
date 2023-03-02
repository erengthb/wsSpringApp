package com.hoaxify.ws.auth;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
	
	@PostMapping("/api/1.0/auth")
	void handleAuthentication() {
		
	}

}
