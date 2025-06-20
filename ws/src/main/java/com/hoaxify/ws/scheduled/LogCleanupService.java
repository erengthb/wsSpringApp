package com.hoaxify.ws.scheduled;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hoaxify.ws.log.LogRecordRepository;

import java.time.LocalDateTime;

@Service
public class LogCleanupService {

    @Autowired
    private LogRecordRepository logRecordRepository;

    @Transactional
    @Scheduled(cron = "${app.log-cleanup.cron}", zone = "Europe/Istanbul")
    public void cleanupOldLogs() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(1);
        System.out.println("Log cleanup started at " + LocalDateTime.now());
        logRecordRepository.deleteByTimestampBefore(threshold);
        System.out.println("Log cleanup finished at " + LocalDateTime.now());
    }
}
