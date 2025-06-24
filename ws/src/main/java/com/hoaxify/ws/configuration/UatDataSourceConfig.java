package com.hoaxify.ws.configuration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

import java.net.URI;
import java.net.URISyntaxException;

@Configuration
@Profile("uat")  // Sadece uat profilinde aktif olur
public class UatDataSourceConfig {

    @Bean
    public DataSource dataSource() throws URISyntaxException {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null) {
            throw new RuntimeException("DATABASE_URL environment variable is not set.");
        }

        URI dbUri = new URI(databaseUrl);

        String username = null;
        String password = null;

        if (dbUri.getUserInfo() != null) {
            String[] userInfo = dbUri.getUserInfo().split(":");
            username = userInfo[0];
            password = userInfo.length > 1 ? userInfo[1] : null;
        }

        String jdbcUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        if (username != null) config.setUsername(username);
        if (password != null) config.setPassword(password);
        config.addDataSourceProperty("sslmode", "require");  // SSL genellikle gereklidir Railway için

        return new HikariDataSource(config);
    }
}
