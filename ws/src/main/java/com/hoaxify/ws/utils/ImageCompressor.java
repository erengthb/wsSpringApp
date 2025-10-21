package com.hoaxify.ws.utils;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Iterator;

public class ImageCompressor {

    // ==== Varsayılan hedefler / sınırlar ====
    // Hedef üst boyut (KB). İstersen -Dimg.targetKB=350 şeklinde JVM parametresi ile override edebilirsin.
    private static final int DEFAULT_TARGET_KB =
            Integer.getInteger("img.targetKB", 380);

    // Maksimum genişlik / yükseklik. -Dimg.maxW=1600 -Dimg.maxH=1600 ile override edilebilir.
    private static final int DEFAULT_MAX_W =
            Integer.getInteger("img.maxW", 1600);
    private static final int DEFAULT_MAX_H =
            Integer.getInteger("img.maxH", 1600);

    // JPEG için minimum kalite alt sınırı. -Dimg.minQ=35 (yüzde olarak) ile override edilebilir.
    private static final float DEFAULT_MIN_JPEG_QUALITY =
            (float) (Integer.getInteger("img.minQ", 35) / 100.0);

    /**
     * Görseli sıkıştırır ve hedef dosyaya kaydeder.
     *
     * @param input      Orijinal görsel (InputStream)
     * @param outputFile Yazılacak hedef dosya (uzantı formatı belirler: .jpg/.jpeg/.png/.webp)
     * @param quality    Başlangıç kalite ipucu (0.0–1.0). JPEG’de anlamlıdır, diğer formatlarda yok sayılır.
     */
    public void compress(InputStream input, File outputFile, double quality) throws IOException {
        if (input == null) throw new IOException("null_input");
        if (outputFile == null) throw new IOException("null_output");

        // 1) Oku
        BufferedImage src = ImageIO.read(input);
        if (src == null) throw new IOException("invalid_image");

        // 2) Gerekirse yeniden boyutlandır (1600x1600 varsayılan)
        BufferedImage img = downscaleIfNeeded(
                src,
                DEFAULT_MAX_W,
                DEFAULT_MAX_H
        );

        // 3) Çıkış formatını dosya uzantısından anla (akışını bozmamak için)
        String outFormat = inferFormatFromExtension(outputFile.getName()); // "jpeg" | "png" | "webp" vs.
        if (outFormat == null) {
            // bilinmeyen ise güvenli düşüş: jpeg
            outFormat = "jpeg";
        }

        // 4) Adaptif hedef KB: önce kalite (JPEG ise), sonra ölçek
        byte[] result = adaptivelyEncodeToTarget(img, outFormat, clampQuality(quality), DEFAULT_TARGET_KB);

        // 5) Dosyaya yaz
        try (FileOutputStream fos = new FileOutputStream(outputFile)) {
            fos.write(result);
        }
    }

    // ==== Yardımcılar ====

    private String inferFormatFromExtension(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "jpeg";
        if (lower.endsWith(".png")) return "png";
        if (lower.endsWith(".webp")) return hasWebpWriter() ? "webp" : "jpeg"; // webp yoksa jpeg'e düş
        return null;
    }

    private boolean hasWebpWriter() {
        Iterator<ImageWriter> it = ImageIO.getImageWritersByFormatName("webp");
        return it.hasNext();
    }

    private float clampQuality(double q) {
        if (Double.isNaN(q)) return 0.80f;
        float f = (float) q;
        if (f <= 0f) return 0.80f; // mantıklı bir başlangıç
        if (f > 1f) return 1.0f;
        return f;
    }

    private BufferedImage downscaleIfNeeded(BufferedImage src, int maxW, int maxH) {
        int w = src.getWidth();
        int h = src.getHeight();
        double scale = 1.0;

        if (w > maxW || h > maxH) {
            double sw = (double) maxW / w;
            double sh = (double) maxH / h;
            scale = Math.min(sw, sh);
        }
        if (scale >= 1.0) return src; // küçültme gerekmiyor

        int newW = Math.max(1, (int) Math.round(w * scale));
        int newH = Math.max(1, (int) Math.round(h * scale));

        BufferedImage out = new BufferedImage(newW, newH,
                src.getColorModel().hasAlpha() ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB);

        Graphics2D g = out.createGraphics();
        try {
            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g.drawImage(src, 0, 0, newW, newH, null);
        } finally {
            g.dispose();
        }
        return out;
    }

    private byte[] adaptivelyEncodeToTarget(BufferedImage img, String format, float initialJpegQuality, int targetKB) throws IOException {
        final int targetBytes = Math.max(1, targetKB) * 1024;

        // en fazla 3 tur: (kalite → ölçek) döngüsü
        double scale = 1.0;
        byte[] best = null;

        for (int round = 0; round < 3; round++) {
            BufferedImage working = (scale == 1.0) ? img : rescale(img, scale);

            if (format.equalsIgnoreCase("jpeg")) {
                // JPEG: kaliteyi kademeli indir (80% → min)
                float q = initialJpegQuality;
                while (q >= DEFAULT_MIN_JPEG_QUALITY) {
                    byte[] bytes = encodeJPEG(working, q);
                    best = pickBetter(best, bytes);
                    if (bytes.length <= targetBytes) return bytes;
                    q -= 0.10f;
                }
            } else if (format.equalsIgnoreCase("webp")) {
                // WebP için ImageIO plugin şart; yoksa 'infer' aşamasında zaten JPEG'e düşülmüştür.
                byte[] bytes = encodeGeneric(working, "webp");
                best = pickBetter(best, bytes);
                if (bytes.length <= targetBytes) return bytes;
            } else { // PNG ya da diğerleri: kalite kontrolü yok → sadece ölçek
                byte[] bytes = encodeGeneric(working, "png");
                best = pickBetter(best, bytes);
                if (bytes.length <= targetBytes) return bytes;
            }

            // hedefe inemedi → ölçeği biraz daha düşür ve yeni tura gir
            scale *= 0.85; // %15 daha küçült
        }

        // hedefin üstündeyse bile eldeki en iyi sonucu döndür
        return best != null ? best : encodeJPEG(img, Math.max(DEFAULT_MIN_JPEG_QUALITY, 0.75f));
    }

    private byte[] pickBetter(byte[] a, byte[] b) {
        if (a == null) return b;
        if (b == null) return a;
        // daha küçük olanı "daha iyi" sayıyoruz (kaliteyi zaten kademeli indiriyoruz)
        return (b.length < a.length) ? b : a;
    }

    private BufferedImage rescale(BufferedImage src, double scale) {
        int newW = Math.max(1, (int) Math.round(src.getWidth() * scale));
        int newH = Math.max(1, (int) Math.round(src.getHeight() * scale));
        BufferedImage out = new BufferedImage(newW, newH,
                src.getColorModel().hasAlpha() ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB);

        Graphics2D g = out.createGraphics();
        try {
            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g.drawImage(src, 0, 0, newW, newH, null);
        } finally {
            g.dispose();
        }
        return out;
    }

    private byte[] encodeJPEG(BufferedImage img, float quality) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream(64 * 1024);
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
        if (!writers.hasNext()) throw new IOException("no_jpeg_writer");
        ImageWriter writer = writers.next();
        try (ImageOutputStream ios = ImageIO.createImageOutputStream(baos)) {
            writer.setOutput(ios);
            ImageWriteParam param = writer.getDefaultWriteParam();
            if (param.canWriteCompressed()) {
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(Math.max(DEFAULT_MIN_JPEG_QUALITY, Math.min(1.0f, quality)));
            }
            // JPEG alfa desteklemez; varsa siyah arka plan riskine karşı alfa flatten
            BufferedImage prepared = img;
            if (img.getColorModel().hasAlpha()) {
                prepared = flattenAlpha(img, Color.WHITE);
            }
            writer.write(null, new IIOImage(prepared, null, null), param);
        } finally {
            writer.dispose();
        }
        return baos.toByteArray();
    }

    private byte[] encodeGeneric(BufferedImage img, String format) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream(64 * 1024);
        ImageIO.write(img, format, baos);
        return baos.toByteArray();
    }

    private BufferedImage flattenAlpha(BufferedImage src, Color bg) {
        if (!src.getColorModel().hasAlpha()) return src;
        BufferedImage out = new BufferedImage(src.getWidth(), src.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g = out.createGraphics();
        try {
            g.setColor(bg);
            g.fillRect(0, 0, out.getWidth(), out.getHeight());
            g.drawImage(src, 0, 0, null);
        } finally {
            g.dispose();
        }
        return out;
    }
}
