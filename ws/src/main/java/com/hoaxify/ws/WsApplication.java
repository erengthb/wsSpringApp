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
						
				User user1 = new User();
				user1.setUsername("test"+1);
				user1.setDisplayName("test"+1);
				user1.setPassword("Erend16");
				userService.save(user1);
				
				User user2 = new User();
				user2.setUsername("test"+2);
				user2.setDisplayName("test"+2);
				user2.setPassword("Erend16");
				userService.save(user2);
				
				User user3 = new User();
				user3.setUsername("test"+3);
				user3.setDisplayName("test"+3);
				user3.setPassword("Erend16");
				userService.save(user3);
			
				User user4 = new User();
				user4.setUsername("test"+4);
				user4.setDisplayName("test"+4);
				user4.setPassword("Erend16");
				userService.save(user4);
			
				User user5 = new User();
				user5.setUsername("eren");
				user5.setDisplayName("eren");
				user5.setPassword("Erend16.");
				userService.save(user5);
			
		};
	}

}