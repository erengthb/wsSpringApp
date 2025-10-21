package com.hoaxify.ws.configuration;

import java.io.File;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.lang.NonNull;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    private final AppConfiguration appConfiguration;

    public WebConfiguration(AppConfiguration appConfiguration) {
        this.appConfiguration = appConfiguration;
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        String uploadPath = appConfiguration.getUploadPath();
        String normalized = org.springframework.util.StringUtils.trimTrailingCharacter(uploadPath, '/');
    
        boolean isAbsolute = new File(normalized).isAbsolute();
        String locationPrefix = isAbsolute ? "file:" : "file:./";
    
        // 365 gün cache + immutable
        var longCache = CacheControl.maxAge(java.time.Duration.ofDays(365)).cachePublic().immutable();
    
        String ppLocation = locationPrefix + normalized + "/" + appConfiguration.getProfilePicturesDir() + "/";
        registry.addResourceHandler("/profilepictures/**")
                .addResourceLocations(ppLocation)
                .setCacheControl(longCache);
    
        registry.addResourceHandler("/stocks/**")
                .addResourceLocations(locationPrefix + normalized + "/stocks/")
                .setCacheControl(longCache);
    }
    
    @Bean
    CommandLineRunner createStorageDirectories() {
        return (args) -> {
            File root = new File(appConfiguration.getUploadPath());
            if (!root.exists()) root.mkdirs();
    
            String ppDir = appConfiguration.getProfilePicturesDir();
            if (ppDir != null && !ppDir.isEmpty()) {
                new File(root, ppDir).mkdirs();
            }
    
            String stDir = appConfiguration.getStocksDir();
            if (stDir != null && !stDir.isEmpty()) {
                new File(root, stDir).mkdirs();
            }
            // System.out debug loglarını çıkarıyoruz -> stdout log maliyeti azalır
        };
    }
    
}
