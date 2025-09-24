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
        // uploadPath hem relative (dev: "storage-dev") hem absolute (prod: "/data/uploads") olabilir
        String uploadPath = appConfiguration.getUploadPath();
        String normalized = StringUtils.trimTrailingCharacter(uploadPath, '/');

        // Absolute ise "file:/abs/path/"; relative ise "file:./rel/path/"
        boolean isAbsolute = new File(normalized).isAbsolute();
        String locationPrefix = isAbsolute ? "file:" : "file:./";
        String resourceLocation = locationPrefix + normalized + "/";

        registry.addResourceHandler("/images/**")
                .addResourceLocations(resourceLocation)
                .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));
    }

    @Bean
    CommandLineRunner createStorageDirectories() {
        return (args) -> {
            // root (uploadPath)
            File root = new File(appConfiguration.getUploadPath());
            if (!root.exists()) {
                root.mkdirs();
            }

            // alt klasörler (varsa)
            String ppDir = appConfiguration.getProfilePicturesDir();
            if (ppDir != null && !ppDir.isEmpty()) {
                File pp = new File(root, ppDir);
                if (!pp.exists()) pp.mkdirs();
            }

            String stDir = appConfiguration.getStocksDir();
            if (stDir != null && !stDir.isEmpty()) {
                File st = new File(root, stDir);
                if (!st.exists()) st.mkdirs();
            }
        };
    }
}
