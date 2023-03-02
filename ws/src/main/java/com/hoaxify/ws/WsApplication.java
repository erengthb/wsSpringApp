package com.hoaxify.ws;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;

import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserService;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class WsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WsApplication.class, args);
	}
	
	@Autowired
	UserService userService ; 
	
	@Bean   // Uygulama başlarken bu kısmın çalışmasını sağlar CommandLineRunner Classı
	CommandLineRunner createInitialUsers(UserService userService) {  // şifrenin hashli bir şekilde kaydedilmesi için userService inject edildi
		
		
		return (args) -> {
				User user = new User();
				
				user.setUsername("test");
				user.setDisplayName("test");
				user.setPassword("Erend16.");
				user.setCreateDate(userService.getCreateDate());
				userService.save(user);
				
			
		};
		
				
	}

}
