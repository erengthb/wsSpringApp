package com.hoaxify.ws.utils;

import java.sql.Timestamp;
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

	public static Timestamp getCurrentTimestamp() {
		// Şu anki tarih ve saati, sistem saat dilimine göre al
		ZonedDateTime now = ZonedDateTime.now();
		// Timestamp formatına dönüştür
		return Timestamp.valueOf(now.toLocalDateTime());
	}

	public static String getCurrentTimeWithMillis() {
		// Şu anki tarih ve saati al
		LocalDateTime now = LocalDateTime.now();
		// Saat, dakika, saniye ve nanosaniye formatını belirle
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss.SSS");
		// Formatlanmış String olarak döndür
		return now.format(formatter);
	}

}
