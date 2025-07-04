package com.hoaxify.ws.captcha;

import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/1.0/captcha")
public class CaptchaController {

    private final Map<String, CaptchaData> captchaStore = new ConcurrentHashMap<>();
    private final Random random = new Random();
    private final long EXPIRATION_TIME_MS = 5 * 60 * 1000; // 5 dakika

    public Map<String, CaptchaData> getCaptchaStore() {
        return captchaStore;
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestCaptcha() throws IOException {
        String captchaId = UUID.randomUUID().toString();
        String code = generateCode(5); // 5 karakterli kod (harf ve rakam)
        long now = System.currentTimeMillis();

        captchaStore.put(captchaId, new CaptchaData(code, now));

        String base64Image = generateCaptchaImageBase64(code);

        Map<String, String> response = new HashMap<>();
        response.put("captchaId", captchaId);
        response.put("captchaImage", base64Image); // base64 olarak image döner

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCaptcha(@RequestBody @Valid CaptchaVerifyRequest request) {
        CaptchaData data = captchaStore.get(request.captchaId());

        if (data == null || isExpired(data.createdAt())) {
            return ResponseEntity.badRequest().body(Map.of("result", "fail", "message", "CAPTCHA expired or invalid"));
        }

        if (data.code().equalsIgnoreCase(request.captchaInput())) {
            captchaStore.remove(request.captchaId());
            return ResponseEntity.ok(Map.of("result", "success"));
        }
        return ResponseEntity.badRequest().body(Map.of("result", "fail", "message", "Invalid CAPTCHA"));
    }

    private boolean isExpired(long createTime) {
        return System.currentTimeMillis() - createTime > EXPIRATION_TIME_MS;
    }

    private String generateCode(int length) {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // kolay karışanlar çıkarıldı (I,O,1,0)
        StringBuilder sb = new StringBuilder();
        for (int i=0; i<length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private String generateCaptchaImageBase64(String code) throws IOException {
        int width = 160;
        int height = 60;

        BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = bufferedImage.createGraphics();

        // Arkaplan
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, width, height);

        // Gürültü çizgileri
        g2d.setColor(Color.LIGHT_GRAY);
        for (int i=0; i<15; i++) {
            int x1 = random.nextInt(width);
            int y1 = random.nextInt(height);
            int x2 = random.nextInt(width);
            int y2 = random.nextInt(height);
            g2d.drawLine(x1, y1, x2, y2);
        }

        // Metin ayarları
        g2d.setFont(new Font("Arial", Font.BOLD, 40));
        g2d.setColor(Color.BLACK);

        // Karakterleri çiz
        for (int i=0; i<code.length(); i++) {
            int x = 20 + i*28;
            int y = 45 + (random.nextInt(10) - 5); // hafif dikey oynama
            double rotation = (random.nextInt(30) - 15) * Math.PI / 180;
            g2d.rotate(rotation, x, y);
            g2d.drawString(String.valueOf(code.charAt(i)), x, y);
            g2d.rotate(-rotation, x, y);
        }

        g2d.dispose();

        // Görseli Base64 string olarak encode et
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", baos);
        byte[] bytes = baos.toByteArray();
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(bytes);
    }

    public static record CaptchaData(String code, long createdAt) {}

    public record CaptchaVerifyRequest(String captchaId, String captchaInput) {}
}
