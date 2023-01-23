package com.hoaxify.ws.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="users")
public class User {

 @Id
 @GeneratedValue
 private Long id;	
	
 private String username;
 
 private String displayName;
 
 private String password;
	
}
