package com.hoaxify.ws.file;

import com.hoaxify.ws.configuration.AppConfiguration;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class FileService {

    private final AppConfiguration appConfiguration;
    private final Tika tika = new Tika();

    // Boyut ve tip kısıtları
    private static final long MAX_BYTES = 5L * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_MIME = Set.of(
            "image/png", "image/jpeg", "image/webp"
    );

    public FileService(AppConfiguration appConfiguration) {
        this.appConfiguration = appConfiguration;
    }

    // ====== YENİ: Multipart ile PROFIL resmi kaydet ======
    // uploads/profilepictures/{userId}/{userId}-{uuid}.ext
    public String saveUserProfileImage(Long userId, MultipartFile file) throws IOException {
        validateMultipart(file);
        String mime = detectType(file);           // Tika ile MIME
        String ext  = extensionFor(mime);         // .png/.jpg/.webp

        String subDir = "profilepictures/" + userId;
        String safeSubDir = sanitizeSubPath(subDir);

        Path dir = Paths.get(appConfiguration.getUploadPath(), safeSubDir);
        Files.createDirectories(dir);

        String fileName = userId + "-" + generateRandomName() + ext;
        Path target = dir.resolve(fileName);

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        return safeSubDir + "/" + fileName;       // DB'ye yazılacak relative path
    }

    // ====== YENİ: Multipart ile STOK resmi kaydet ======
    // uploads/stocks/{userId}/{prefix}-{uuid}.ext  (prefix=stockId varsa o; yoksa userId)
    public String saveStockImage(String userName, Long stockId, MultipartFile file) throws IOException {
        validateMultipart(file);
        String mime = detectType(file); // MIME tipi tespiti
        String ext = extensionFor(mime); // Dosya uzantısını al (örneğin .png, .jpg)
    
        String subDir = "stocks/" + userName; // Kullanıcının stok resimleri için dizin
        String safeSubDir = sanitizeSubPath(subDir);
    
        Path dir = Paths.get(appConfiguration.getUploadPath(), safeSubDir);
        Files.createDirectories(dir); // Dizin var mı kontrol et, yoksa oluştur
    
        String prefix = (stockId != null ? String.valueOf(stockId) : String.valueOf(userName)); // Prefix, stockId veya userId olabilir
        String fileName = prefix + "-" + generateRandomName() + ext;
        Path target = dir.resolve(fileName);
    
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }
    
        return safeSubDir + "/" + fileName; // Veritabanına kaydedilecek göreli yol
    }

  
    

    // ====== SİLME ======
    public void deleteFile(String relativePath) {
        if (relativePath == null || relativePath.isBlank()) return;
        try {
            Path p = Paths.get(appConfiguration.getUploadPath(), sanitizeSubPath(relativePath));
            Files.deleteIfExists(p);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // ====== ESKİ METODU DOKUNMADAN BIRAKIYORUM ======
    // (base64 payload bekler – artık göndermeyeceksin ama başka yerde kullanıyorsun demiştin)
    public String detectType(String base64Payload) {
        try {
            byte[] data = java.util.Base64.getDecoder().decode(base64Payload);
            return tika.detect(data);
        } catch (IllegalArgumentException e) {
            // Geçersiz base64 gelirse en azından düşmesin
            return "application/octet-stream";
        }
    }

    // ====== YENİ OVERLOAD: Multipart için detectType ======
    public String detectType(MultipartFile file) throws IOException {
        try (InputStream in = file.getInputStream()) {
            return tika.detect(in);
        }
    }

    // === Yardımcılar ===
    private void validateMultipart(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) throw new IOException("empty_file");
        if (file.getSize() > MAX_BYTES) throw new IOException("file_too_large");

        // İçerikten MIME tespiti (sadece Content-Type’a güvenme)
        String mime = detectType(file);
        if (!ALLOWED_MIME.contains(mime)) throw new IOException("unsupported_mime:" + mime);
    }

    private String extensionFor(String mime) {
        return switch (mime) {
            case "image/png"  -> ".png";
            case "image/jpeg" -> ".jpg";
            case "image/webp" -> ".webp";
            default -> ".bin";
        };
    }

    private String sanitizeSubPath(String p) {
        if (p == null) return "";
        String norm = p.replace("\\", "/");
        if (norm.contains("..")) throw new IllegalArgumentException("invalid_path");
        if (norm.startsWith("/")) norm = norm.substring(1);
        if (norm.endsWith("/")) norm = norm.substring(0, norm.length() - 1);
        return norm;
    }

    private String generateRandomName() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}
