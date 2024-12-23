package com.hoaxify.ws.hoaxes;

import jakarta.persistence.Column;
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

	@NotBlank(message = "{hoaxify.constraint.hoaxcontent.NotBlank.message}")
	@Size(min = 1, max = 1000)
	@Column(length = 1000)
	private String content;

	private String hoaxUser;

	private String createDate;

	private String createTime;

}
