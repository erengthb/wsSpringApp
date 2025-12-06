package com.hoaxify.ws.configuration;

import java.util.List;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS aktif
        .csrf(csrf -> csrf.disable()) // Stateless API için CSRF kapalı
        .headers(headers -> headers.frameOptions(frame -> frame.disable())) // H2 console için zorunlu
        .httpBasic(httpBasic -> httpBasic.authenticationEntryPoint(new AuthEntryPoint()))
        .authorizeHttpRequests(auth -> auth
            // Preflight OPTIONS isteklerini serbest bırak
            .requestMatchers(new AntPathRequestMatcher("/**", HttpMethod.OPTIONS.name())).permitAll()

            // H2 Console erişimine izin ver
            .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()

            // Authenticated endpointler
            .requestMatchers(new AntPathRequestMatcher("/api/1.0/auth", "POST")).permitAll()
            .requestMatchers(new AntPathRequestMatcher("/api/1.0/users/{username}", "PUT")).authenticated()
            .requestMatchers(new AntPathRequestMatcher("/api/1.0/hoaxes", "POST")).authenticated()
            .requestMatchers(new AntPathRequestMatcher("/api/1.0/hoaxes/*", "PUT")).authenticated()
            .requestMatchers(new AntPathRequestMatcher("/api/1.0/hoaxes/*", "DELETE")).authenticated()
            .requestMatchers(new AntPathRequestMatcher("/api/1.0/support/**")).authenticated()
            .requestMatchers(new AntPathRequestMatcher("/api/admin/**")).authenticated()
            .requestMatchers(new AntPathRequestMatcher("/api/1.0/users/*/follow", "POST")).authenticated()
            .requestMatchers(new AntPathRequestMatcher("/api/1.0/users/*/unfollow", "POST")).authenticated()

            // Diğer tüm endpointlere izin ver
            .anyRequest().permitAll()
        )
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .build();
}


@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of(
        "http://localhost:3000",
        "https://otoenvanter.com",
        "https://www.otoenvanter.com"
    ));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
    configuration.setAllowedHeaders(List.of(
        "Authorization","Content-Type","X-Requested-With","Accept","Origin",
        "Access-Control-Request-Method","Access-Control-Request-Headers"
    ));
    configuration.setAllowCredentials(true);

    // <-- EK: Preflight yanıtını 1 saat cache’le
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}

//test
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
