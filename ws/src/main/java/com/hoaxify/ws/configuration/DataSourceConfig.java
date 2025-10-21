package com.hoaxify.ws.configuration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@Profile({"uat", "production"})
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null) {
            throw new RuntimeException("DATABASE_URL environment variable is not set!");
        }

        // postgres://user:pass@host:port/dbname
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

        // ---- Tutumlu havuz ayarları (küçük API için yeterli) ----
        config.setMaximumPoolSize(Integer.parseInt(System.getProperty("db.pool.max", "10")));
        config.setMinimumIdle(Integer.parseInt(System.getProperty("db.pool.minIdle", "2")));
        config.setIdleTimeout(Long.parseLong(System.getProperty("db.pool.idleTimeoutMs", "300000")));     // 5 dk
        config.setMaxLifetime(Long.parseLong(System.getProperty("db.pool.maxLifetimeMs", "1800000")));     // 30 dk
        config.setConnectionTimeout(Long.parseLong(System.getProperty("db.pool.connTimeoutMs", "10000"))); // 10 sn
        config.setLeakDetectionThreshold(Long.parseLong(System.getProperty("db.pool.leakMs", "30000")));    // 30 sn

        // Prepared statement cache (driver düzeyi)
        Properties dsProps = new Properties();
        dsProps.setProperty("cachePrepStmts", "true");
        dsProps.setProperty("prepStmtCacheSize", "256");
        dsProps.setProperty("prepStmtCacheSqlLimit", "2048");
        config.setDataSourceProperties(dsProps);

        // Connection test/keepalive
        config.setKeepaliveTime(Long.parseLong(System.getProperty("db.pool.keepAliveMs", "300000"))); // 5 dk

        return new HikariDataSource(config);
    }
}
