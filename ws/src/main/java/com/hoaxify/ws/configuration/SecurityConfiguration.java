package com.hoaxify.ws.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {

	@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http.cors();

    http.csrf().disable();
    http.headers().frameOptions().disable();

    http.httpBasic().authenticationEntryPoint(new AuthEntryPoint());

    http.authorizeHttpRequests()
        .requestMatchers(new AntPathRequestMatcher("/api/1.0/auth", HttpMethod.POST.name())).authenticated()
        .requestMatchers(new AntPathRequestMatcher("/api/1.0/users/{username}", HttpMethod.PUT.name())).authenticated()
        .requestMatchers(new AntPathRequestMatcher("/api/1.0/hoaxes", HttpMethod.PUT.name())).permitAll()
        .anyRequest().permitAll();

    http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

    return http.build();
}



	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}