package com.hoaxify.ws.user;


import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hoaxify.ws.user.vm.UserUpdateVM;

import error.NotFoundException;

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
	
	public Page<User> getUsers(Pageable page, User user) {
		if(user != null) {
			return userRepository.findByUsernameNot(user.getUsername(), page);
		}
		return userRepository.findAll(page);
	}
	
	// bu metodu daha sonra core package sinin içine alacağız
    public static String getCreateDate () {	
		Date  now = new Date ();   
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy"); 
	    String day = dateFormat.format(now);
	    return day;
	}

	public User getByUsername(String username) {
	    User inDB = userRepository.findByUsername(username);
	    if(inDB==null) {
	    	throw new NotFoundException();
	    } else {
	    	return inDB;
	    }
	}

	public User updateUser(String username, UserUpdateVM updatedUser) {
		 User inDB = userRepository.findByUsername(username);
		 inDB.setDisplayName(updatedUser.getDisplayName());
		 return  userRepository.save(inDB);
	}
	
}
