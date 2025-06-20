package com.hoaxify.ws.scheduled;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.hoaxify.ws.log.LogRecordRepository;

import java.time.LocalDateTime;

@Service
public class LogCleanupService {

    @Autowired
    private LogRecordRepository logRecordRepository;

  
    @Scheduled(cron = "${app.log-cleanup.cron}") // milisaniye cinsinden: 1 gün
    public void cleanupOldLogs() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);
        logRecordRepository.deleteByTimestampBefore(threshold);
    }
}
