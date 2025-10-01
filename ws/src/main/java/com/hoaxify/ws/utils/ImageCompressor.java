package com.hoaxify.ws.utils;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.stereotype.Component;

import net.coobird.thumbnailator.Thumbnails;

@Component
public class ImageCompressor {

    /**
     * Görseli sıkıştırır ve hedef dosyaya kaydeder.
     * 
     * @param input      InputStream - Orijinal görsel
     * @param outputFile Hedef dosya (kaydedilecek yer)
     * @param quality    Kalite (0.0 - 1.0 arası, varsayılan 0.7)
     */
    public void compress(InputStream input, File outputFile, double quality) throws IOException {
        Thumbnails.of(input)
                .scale(1.0) // Resim boyutlarını koru
                .outputQuality(quality)
                .toFile(outputFile);
    }
}
