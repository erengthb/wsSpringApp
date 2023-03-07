package com.hoaxify.ws.user;


import com.fasterxml.jackson.annotation.JsonView;
import com.hoaxify.ws.shared.Views;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
@Table(name="users")
public class User {

 @Id
 @GeneratedValue
 private Long id;	
	
 @NotBlank(message = "{hoaxify.constraint.username.NotBlank.message}")
 @Size(min = 4 , max = 255)
 @UniqueUsername
 @JsonView(Views.Base.class)
 private String username;
 
 @NotBlank
 @Size(min = 4 , max = 255)
 @JsonView(Views.Base.class)
 private String displayName;
 
 @NotBlank
 @Pattern(regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{hoaxify.constraint.password.Pattern.message}")
 @Size(min = 8 , max = 100)
 @JsonView(Views.Sensitive.class)
 private String password;
	
 private String createDate;
 
 @JsonView(Views.Base.class)
 private String image;
 
}
