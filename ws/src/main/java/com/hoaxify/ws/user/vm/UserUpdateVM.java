package com.hoaxify.ws.user.vm;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateVM {

	@NotBlank
	@Size(min = 4 , max = 255)
	private String displayName;

	private String image;

}