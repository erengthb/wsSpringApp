package com.hoaxify.ws.Utils;


public class StringUtil {

    /**
     * String'in boş veya null olup olmadığını kontrol eder.
     * @param str Kontrol edilecek string
     * @return String boşsa true, değilse false
     */
    public static boolean isEmpty(String str) {
        return str == null || str.isEmpty() || str.trim().isEmpty();
    }


}
