package com.hoaxify.ws.configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.lang.NonNull;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.util.concurrent.TimeUnit;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    private final AppConfiguration appConfiguration;

    public WebConfiguration(AppConfiguration appConfiguration) {
        this.appConfiguration = appConfiguration;
    }

    @Override
public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
    // Upload path'i alıyoruz ve sonundaki '/' karakterini kesiyoruz
    String uploadPath = appConfiguration.getUploadPath();
    String normalized = StringUtils.trimTrailingCharacter(uploadPath, '/');

    // Path'in absolute veya relative olup olmadığını kontrol ediyoruz
    boolean isAbsolute = new File(normalized).isAbsolute();
    String locationPrefix = isAbsolute ? "file:" : "file:./";
    String resourceLocation = locationPrefix + normalized + "/";


    // PROFIL RESİMLERİ İÇİN DÜZELTİLMİŞ KISIM
    String ppLocation = locationPrefix + normalized + "/" + appConfiguration.getProfilePicturesDir() + "/";
    registry.addResourceHandler("/profilepictures/**")
            .addResourceLocations(ppLocation)
            .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));

    // Eğer başka bir resim dizini varsa (örneğin stocks)
    registry.addResourceHandler("/stocks/**")
            .addResourceLocations(resourceLocation + "/stocks/")
            .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));
}

    // ...

    @Bean
    CommandLineRunner createStorageDirectories() {
        return (args) -> {
            // root (uploadPath)
            File root = new File(appConfiguration.getUploadPath());
            System.out.println("Upload Path: " + root);  // Debugging
            if (!root.exists()) {
                root.mkdirs();
            }

            // alt klasörler (varsa)
            String ppDir = appConfiguration.getProfilePicturesDir();
            System.out.println("Profile Pictures Dir: " + ppDir);  // Debugging
            if (ppDir != null && !ppDir.isEmpty()) {
                File pp = new File(root, ppDir);
                if (!pp.exists()) pp.mkdirs();
            }

            String stDir = appConfiguration.getStocksDir();
            System.out.println("Stocks Dir: " + stDir);  // Debugging
            if (stDir != null && !stDir.isEmpty()) {
                File st = new File(root, stDir);
                if (!st.exists()) st.mkdirs();
            }
        };
    }
}
