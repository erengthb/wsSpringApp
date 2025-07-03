package com.hoaxify.ws.user;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User implements UserDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "{hoaxify.constraint.username.NotBlank.message}")
	@Size(min = 4, max = 255)
	@UniqueUsernameAnnotation
	private String username;

	@NotBlank
	@Size(min = 4, max = 255)
	private String displayName;

	@NotBlank
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{hoaxify.constraint.password.Pattern.message}")
	@Size(min = 8, max = 100)
	private String password;

	private String createDate;

	private String image;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
		name = "user_followers",
		joinColumns = @JoinColumn(name = "follower_id"),
		inverseJoinColumns = @JoinColumn(name = "following_id")
	)
	private Set<User> following = new HashSet<>();
	
	@ManyToMany(mappedBy = "following", fetch = FetchType.LAZY)
	private Set<User> followers = new HashSet<>();
	



	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return AuthorityUtils.createAuthorityList("Role_user");
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

}
