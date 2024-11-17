package com.hoaxify.ws.shared;

import java.util.Arrays;
import java.util.stream.Collectors;

import org.hibernate.validator.constraintvalidation.HibernateConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

import com.hoaxify.ws.file.FileService;
import com.hoaxify.ws.utils.StringUtil;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class FileTypeValidator implements ConstraintValidator<FileTypeAnnotation, String> {

	@Autowired
	FileService fileService;

	String[] types;

	@Override
	public void initialize(FileTypeAnnotation constraintAnnotation) {
		this.types = constraintAnnotation.types();
	}

	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {

		if (StringUtil.isNullOrEmpty(value)) {
			return true;
		}
		String fileType = fileService.detectType(value);

		for (String supportedType : this.types) {
			if (fileType.contains(supportedType)) {
				return true;
			}

		}

		String supportedTypes = Arrays.stream(this.types).collect(Collectors.joining(", "));

		context.disableDefaultConstraintViolation();
		HibernateConstraintValidatorContext hibernateConstraintValidatorContext = context
				.unwrap(HibernateConstraintValidatorContext.class);

		hibernateConstraintValidatorContext.addMessageParameter("types", supportedTypes);
		hibernateConstraintValidatorContext
				.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
				.addConstraintViolation();

		return false;
	}

}
