package com.hoaxify.ws.scheduled;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.hoaxify.ws.captcha.CaptchaController;

import java.util.Map;

@Component
public class CaptchaCleanupTask {

    private final Map<String, CaptchaController.CaptchaData> captchaStore;

    // CaptchaController içindeki captchaStore'u buraya geçir (constructor injection ile)
    public CaptchaCleanupTask(CaptchaController captchaController) {
        this.captchaStore = captchaController.getCaptchaStore();
    }

    @Scheduled(fixedRate = 300_000) // 5 dakikada bir (300.000 ms)
    public void clearCaptchaStore() {
        captchaStore.clear();
        System.out.println("CaptchaStore cleared at " + System.currentTimeMillis());
    }
}
