package com.hoaxify.ws.configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserRepository;

@Configuration
@Profile("dev")
public class DevAdminInitializer {

    @Bean
    CommandLineRunner ensureDevAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return (args) -> {
            User admin = userRepository.findByUsername("admin");
            if (admin == null) {
                admin = new User();
                admin.setUsername("admin");
                admin.setDisplayName("Admin");
            }

            // Dev ortamında admin şifresini ve durumu her zaman sabitle
            admin.setPassword(passwordEncoder.encode("Erend16."));
            admin.setStatus(1);
            if (admin.getDisplayName() == null) {
                admin.setDisplayName("Admin");
            }
            userRepository.save(admin);
        };
    }
}
