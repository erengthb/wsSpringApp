package com.hoaxify.ws.user.vm;

import com.hoaxify.ws.shared.ProfileImage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateVM {

	@NotBlank
	@Size(min = 4, max = 255)
	private String displayName;

	@ProfileImage
	private String image;

}