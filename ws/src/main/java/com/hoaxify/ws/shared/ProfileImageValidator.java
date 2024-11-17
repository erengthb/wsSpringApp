package com.hoaxify.ws.shared;

import org.springframework.beans.factory.annotation.Autowired;

import com.hoaxify.ws.file.FileService;
import com.hoaxify.ws.utils.StringUtil;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ProfileImageValidator implements ConstraintValidator<ProfileImage, String> {

	@Autowired
	FileService fileService;

	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {

		if (StringUtil.isNullOrEmpty(value)) {
			return true;
		}
		String fileType = fileService.detectType(value);
		if (fileType.equalsIgnoreCase("image/jpeg") || fileType.equalsIgnoreCase("image/png")) {
			return true;
		}

		return false;
	}

}
