package com.hoaxify.ws.user;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name="users")
public class User {

 @Id
 @GeneratedValue
 private Long id;	
	
 @NotBlank
 private String username;
 
 @NotBlank
 private String displayName;
 
 private String password;
	
}
