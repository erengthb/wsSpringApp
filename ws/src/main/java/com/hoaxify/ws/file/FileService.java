package com.hoaxify.ws.file;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Base64;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hoaxify.ws.configuration.AppConfiguration;

@Service
public class FileService {
	
	@Autowired
	AppConfiguration appConfiguration;
	
	//Util
		public String writeBase64EncodedStringToFile(String image) throws IOException {
			//Constants
			String fileName = generateRandomName();
			File target = new File(appConfiguration.getUploadPath() + "/" +fileName);
			OutputStream outputStream = new FileOutputStream(target);
			byte[] base64Encoded = Base64.getDecoder().decode(image);
			outputStream.write(base64Encoded);
			outputStream.close();
			
			return fileName;
			
		}
	
	public String generateRandomName() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
}
