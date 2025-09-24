package com.hoaxify.ws.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "hoaxify")
public class AppConfiguration {
    private String uploadPath; // storage-dev veya /data/uploads

    public String getProfilePicturesDir() { return "profilepictures"; }
    public String getStocksDir() { return "stocks"; }
}
