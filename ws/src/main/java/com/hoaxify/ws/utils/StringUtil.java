package com.hoaxify.ws.utils;

public class StringUtil {

	/**
	 * String'in boş veya null olup olmadığını kontrol eder.
	 * 
	 * @param str Kontrol edilecek string
	 * @return String boşsa true, değilse false
	 */
	public static boolean isNullOrEmpty(String str) {
		return str == null || str.isEmpty() || str.trim().isEmpty();
	}

}
