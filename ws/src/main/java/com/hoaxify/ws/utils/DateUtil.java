package com.hoaxify.ws.utils;

import java.time.LocalDate;
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

}
