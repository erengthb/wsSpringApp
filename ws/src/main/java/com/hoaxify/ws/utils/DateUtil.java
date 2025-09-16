package com.hoaxify.ws.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtil {

    /**
     * Bu metod, günümüz tarihini "dd.MM.yyyy" formatında döner.
     *
     * @return String - Günümüz tarihini "dd.MM.yyyy" formatında döner.
     */
    public static String getCurrentDateString() {
        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        return currentDate.format(formatter);
    }

    public static LocalDateTime getCurrentLocalDateTime() {
        // Şu anki tarih ve saati LocalDateTime formatında döner
        return LocalDateTime.now();
    }

    public static String getCurrentTimeWithMillis() {
        // Şu anki tarih ve saati al
        LocalDateTime now = LocalDateTime.now();
        // Saat, dakika, saniye ve nanosaniye formatını belirle
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss.SSS");
        // Formatlanmış String olarak döndür
        return now.format(formatter);
    }

    /**
     * Bu metod, günümüz tarihini LocalDateTime formatında ve "yyyy-MM-dd HH:mm:ss" şeklinde döner.
     *
     * @return String - Günümüz tarih ve saatini "yyyy-MM-dd HH:mm:ss" formatında döner.
     */
    public static String getCurrentDateTimeString() {
        LocalDateTime currentDateTime = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return currentDateTime.format(formatter);
    }

}
