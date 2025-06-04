package com.hoaxify.ws.configuration;

import java.io.File;
import java.util.concurrent.TimeUnit;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.lang.NonNull;
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
		registry.addResourceHandler("/images/**")
			.addResourceLocations("file:./" + appConfiguration.getUploadPath() + "/")
			.setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));
	}

	@Bean
	CommandLineRunner createStorageDirectories() {
		return (args) -> {
			File folder = new File(appConfiguration.getUploadPath());
			boolean folderExist = folder.exists() && folder.isDirectory();
			if (!folderExist) {
				folder.mkdir();
			}
		};
	}
}
