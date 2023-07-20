package com.hoaxify.ws.user;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
	
	
	UserRepository userRepository;
	
	PasswordEncoder passwordEncoder;
 
	public UserService(UserRepository userRepository , PasswordEncoder passwordEncoder) {
		super();
		this.userRepository = userRepository;
		this.passwordEncoder= passwordEncoder;
	}



	public void save( User user ) {	
		user.setCreateDate(getCreateDate());
		user.setPassword(this.passwordEncoder.encode(user.getPassword()));
		userRepository.save(user);
		
	}
	
	public List<User> getUsers() {
		return 	userRepository.findAll();	
	}
	
	// bu metodu daha sonra core package sinin içine alacağız
    public static String getCreateDate () {	
		Date  now = new Date ();   
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy"); 
	    String day = dateFormat.format(now);
	    return day;
	}



	
	
}
