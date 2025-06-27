package com.hoaxify.ws.configuration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
@Profile({"uat", "production"})
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null) {
            throw new RuntimeException("DATABASE_URL environment variable is not set!");
        }

        // Railway URL örneği: postgres://username:password@host:port/dbname
        String cleanedUrl = databaseUrl.replace("postgres://", "");
        String[] userInfoAndHost = cleanedUrl.split("@");
        String[] userAndPass = userInfoAndHost[0].split(":");
        String[] hostAndDb = userInfoAndHost[1].split("/", 2);
        String[] hostAndPort = hostAndDb[0].split(":");

        String username = userAndPass[0];
        String password = userAndPass[1];
        String host = hostAndPort[0];
        String port = hostAndPort[1];
        String dbName = hostAndDb[1];

        String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbName + "?sslmode=require";

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);

        return new HikariDataSource(config);
    }
}
