package com.hoaxify.ws.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("https://ws-spring-7a9p2i9oa-erengthbs-projects.vercel.app/")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
