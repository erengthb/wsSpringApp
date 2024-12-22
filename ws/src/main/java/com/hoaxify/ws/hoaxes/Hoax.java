package com.hoaxify.ws.hoaxes;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
@Entity
@Table(name = "hoaxes")
public class Hoax {
	@Id
	@GeneratedValue
	private Long id;

	@NotBlank(message = "{hoaxify.constraint.hoaxcontent.NotBlank.message}")
	private String content;

	private String hoaxUser;
	
	private String createDate;


	
}
