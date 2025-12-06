package com.hoaxify.ws.user;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hoaxify.ws.utils.DateUtil;

@Service
public class UserActivityService {

    private static final long SESSION_GAP_THRESHOLD_SECONDS = 30 * 60; // 30 minutes

    private final UserRepository userRepository;

    public UserActivityService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void recordLogin(User user) {
        if (user == null) {
            return;
        }
        User inDb = userRepository.findByUsername(user.getUsername());
        if (inDb == null) {
            return;
        }
        LocalDateTime now = DateUtil.getCurrentLocalDateTime();
        inDb.setLastLoginAt(now);
        inDb.setLastSeenAt(now);
        userRepository.save(inDb);
    }

    @Transactional
    public void recordActivity(String username) {
        if (username == null || username.isBlank()) {
            return;
        }
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return;
        }

        LocalDateTime now = DateUtil.getCurrentLocalDateTime();
        LocalDateTime lastSeen = user.getLastSeenAt();

        if (lastSeen != null) {
            long gapSeconds = Duration.between(lastSeen, now).getSeconds();
            if (gapSeconds > 0 && gapSeconds <= SESSION_GAP_THRESHOLD_SECONDS) {
                user.setActiveDurationSeconds(user.getActiveDurationSeconds() + gapSeconds);
            }
        }

        user.setLastSeenAt(now);
        userRepository.save(user);
    }
}
