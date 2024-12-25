package com.hoaxify.ws;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import com.hoaxify.ws.hoaxes.Hoax;
import com.hoaxify.ws.hoaxes.HoaxService;

@SpringBootApplication
public class WsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WsApplication.class, args);
	}

	@Bean
	@Profile("dev")
	CommandLineRunner createInitialUsers(HoaxService hoaxService) {
		return (args) -> {

			for (int i = 0; i <= 50; i++) {
				Hoax hoax = new Hoax();
				hoax.setContent("hoax - " + i);
				hoaxService.save(hoax);
			}
		};
	}

}