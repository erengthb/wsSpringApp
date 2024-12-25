package com.hoaxify.ws.utils;

import java.util.List;

public class ListUtil {

	// Listenin null ya da boş olup olmadığını kontrol eder
	public static <T> boolean isEmpty(List<T> list) {
		return list == null || list.isEmpty();
	}
}
