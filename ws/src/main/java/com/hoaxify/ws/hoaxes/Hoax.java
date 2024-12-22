package com.hoaxify.ws.hoaxes;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
@Table(name = "hoaxes")
public class Hoax {
	@Id
	@GeneratedValue
	private Long id;

	@NotBlank(message = "{hoaxify.constraint.username.NotBlank.message}")
	@Size(min = 4, max = 255)
	private String content;

	@Size(min = 4, max = 255)
	private String hoaxUser;
	
	private String createDate;


	
}
