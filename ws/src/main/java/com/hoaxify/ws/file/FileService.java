package com.hoaxify.ws.file;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;

import com.hoaxify.ws.configuration.AppConfiguration;
import com.hoaxify.ws.utils.StringUtil;

@Service
public class FileService {

	AppConfiguration appConfiguration;

	Tika tika;

	public FileService(AppConfiguration appConfiguration) {
		super();
		this.appConfiguration = appConfiguration;
		this.tika = new Tika();
	}

	public String writeBase64EncodedStringToFile(String image) throws IOException {

		String fileName = UUID.randomUUID().toString().replace("-", "");
		File target = new File(appConfiguration.getUploadPath() + "/" + fileName);
		OutputStream outputStream = new FileOutputStream(target);
		byte[] base64Encoded = Base64.getDecoder().decode(image);

		outputStream.write(base64Encoded);
		outputStream.close();

		return fileName;

	}

	public void deleteFile(String oldImageName) {
		if (StringUtil.isNullOrEmpty(oldImageName)) {
			return;
		}
		try {
			Files.deleteIfExists(Paths.get(appConfiguration.getUploadPath(), oldImageName));
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public String detectType(String value) {
		byte[] base64Encoded = Base64.getDecoder().decode(value);
		return tika.detect(base64Encoded);
	}
}
