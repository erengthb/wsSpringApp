package com.hoaxify.ws;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.hoaxify.ws.hoaxes.Hoax;
import com.hoaxify.ws.hoaxes.HoaxService;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserService;

@SpringBootApplication
@ComponentScan(basePackages = { "com.hoaxify.ws", "com.hoaxify.admin" })
@EnableJpaRepositories(basePackages = { "com.hoaxify.ws", "com.hoaxify.admin" })
@EnableScheduling
@EnableJpaAuditing 
public class WsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WsApplication.class, args);
	}
	
	@Bean
	@Profile("dev")
	CommandLineRunner createInitialUsers(UserService userService, HoaxService hoaxService) {
		return (args) -> {
			/*for(int i = 1; i<=25;i++) {				
				User user = new User();
				user.setUsername("user"+i);
				user.setDisplayName("display"+i);
				user.setPassword("P4ssword");
				userService.save(user);
				for(int j = 1;j<=2;j++) {
					Hoax hoax = new Hoax();
					hoax.setContent("hoax (" +j + ") from user ("+i+")");
					hoaxService.save(hoax, user);
				}
			}*/
		};
	}

}
