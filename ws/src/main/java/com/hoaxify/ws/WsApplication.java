package com.hoaxify.ws;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserService;

@SpringBootApplication
public class WsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WsApplication.class, args);
	}
	
	@Bean
	@Profile("dev")
	CommandLineRunner createInitialUsers(UserService userService) {
		return (args) -> {
						
			
			
		};
	}

}