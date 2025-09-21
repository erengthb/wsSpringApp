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
            .csrf(csrf -> csrf.disable()) // Stateless API olduğu için CSRF kapalı
            .headers(headers -> headers.frameOptions(frame -> frame.disable())) // H2 console için
            .httpBasic(httpBasic -> httpBasic.authenticationEntryPoint(new AuthEntryPoint()))
            .authorizeHttpRequests(auth -> auth
                // *** OPTIONS isteği en başta ve permitAll ***
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Authenticated endpointler
                .requestMatchers(new AntPathRequestMatcher("/api/1.0/auth", "POST")).authenticated()
                .requestMatchers(new AntPathRequestMatcher("/api/1.0/users/{username}", "PUT")).authenticated()
                .requestMatchers(new AntPathRequestMatcher("/api/1.0/hoaxes", "PUT")).authenticated()
                
                // Diğer her şey serbest
                .anyRequest().permitAll()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Origin tam eşleşme yerine pattern kullan
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:3000",
            "https://*.vercel.app",
            "https://otoenvanter.com",
            "https://www.otoenvanter.com"
        ));

        // HTTP metodları
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Headerlar
        configuration.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));

        // Cookie / Authorization header desteği
        configuration.setAllowCredentials(true);

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
