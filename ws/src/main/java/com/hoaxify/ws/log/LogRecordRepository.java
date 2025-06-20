package com.hoaxify.ws.log;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;

public interface LogRecordRepository extends JpaRepository<LogRecord, Long> {
    void deleteByTimestampBefore(LocalDateTime timestamp);
}
