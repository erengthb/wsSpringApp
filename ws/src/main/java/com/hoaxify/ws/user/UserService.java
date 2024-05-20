package com.hoaxify.ws.user;


import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.logging.Logger;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hoaxify.ws.file.FileService;
import com.hoaxify.ws.user.vm.UserUpdateVM;

import error.NotFoundException;

@Service
public class UserService {
	private static final Logger logger = Logger.getLogger(UserService.class.getName());

	
	UserRepository userRepository;
	
	PasswordEncoder passwordEncoder;
	
	FileService fileService;
 
	public UserService(UserRepository userRepository , PasswordEncoder passwordEncoder , FileService fileService) {
		this.userRepository = userRepository;
		this.passwordEncoder= passwordEncoder;
		this.fileService = fileService;
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
		User inDB = getByUsername(username);
		inDB.setDisplayName(updatedUser.getDisplayName());
		if(updatedUser.getImage() != null) {
			//inDB.setImage(updatedUser.getImage());
			try {
				String storedFileName = fileService.writeBase64EncodedStringToFile(updatedUser.getImage());
				inDB.setImage(storedFileName);
			} catch (IOException e) {
				logger.severe("Kullanıcı resmi kaydedilirken hata oluştu . Hata Mesajı : " + e);
			}
		}
		return userRepository.save(inDB);
	}
	
	
	
	
}
