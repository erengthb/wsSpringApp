package com.hoaxify.ws.user;


import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

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
public class User implements UserDetails {

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

@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
	return AuthorityUtils.createAuthorityList("Role_user");
}

@Override
public boolean isAccountNonExpired() {
	// TODO Auto-generated method stub
	return true;
}

@Override
public boolean isAccountNonLocked() {
	// TODO Auto-generated method stub
	return true;
}

@Override
public boolean isCredentialsNonExpired() {
	// TODO Auto-generated method stub
	return true;
}

@Override
public boolean isEnabled() {
	// TODO Auto-generated method stub
	return true;
}
 
}
