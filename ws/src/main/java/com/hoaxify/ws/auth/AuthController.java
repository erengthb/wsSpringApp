package com.hoaxify.ws.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserRepository;
import com.hoaxify.ws.user.vm.UserVM;


@RestController
public class AuthController {

	@Autowired
	UserRepository userRepository;
	@Transactional(readOnly = true)
	@PostMapping("/api/1.0/auth")
	UserVM handleAuthentication(@CurrentUserAnnotation User user) {
    return new UserVM(user); 
}


}
