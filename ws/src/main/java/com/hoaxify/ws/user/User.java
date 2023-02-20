package com.hoaxify.ws.user;


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
	
 @NotBlank
 @Size(min = 4 , max = 255)
 private String username;
 
 @NotBlank
 @Size(min = 4 , max = 255)
 private String displayName;
 
 @NotBlank
 @Pattern(regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$")
 @Size(min = 8 , max = 30)
 private String password;
	
}
