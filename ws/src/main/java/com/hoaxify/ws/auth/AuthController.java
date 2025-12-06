package com.hoaxify.ws.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.vm.UserVM;
import com.hoaxify.ws.user.UserActivityService;


@RestController
public class AuthController {

	private final UserActivityService userActivityService;

	@Autowired
	public AuthController(UserActivityService userActivityService) {
		this.userActivityService = userActivityService;
	}

	@PostMapping("/api/1.0/auth")
	public ResponseEntity<?> handleAuthentication(@CurrentUserAnnotation User user) {
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		userActivityService.recordLogin(user);
		return ResponseEntity.ok(new UserVM(user));
	}
}
