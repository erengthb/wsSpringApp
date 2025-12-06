package com.hoaxify.ws.user;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

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

    @NotBlank(message = "Kullanıcı adı zorunludur")
    @Size(min = 4, max = 16, message = "Kullanıcı adı 4-16 karakter olmalı")
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "Kullanıcı adı sadece harf ve rakam içerebilir")
    @UniqueUsernameAnnotation
    private String username;

    @NotBlank(message = "Firma adı zorunludur")
    @Size(min = 2, max = 50, message = "Firma adı 2-50 karakter olmalı")
    private String displayName;

    @NotBlank(message = "Şifre zorunludur")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,16}$",
        message = "Şifre 8-16 karakter olmalı; en az 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermeli"
    )
    private String password;

    @Column(name="create_date", nullable = false)
    private LocalDateTime createDate = LocalDateTime.now();

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "last_seen_at")
    private LocalDateTime lastSeenAt;

    @Column(name = "active_duration_seconds", nullable = false)
    private long activeDurationSeconds = 0;
    
    private String image;

    // Yeni alanlar
    @JsonProperty
    @NotBlank(message = "Telefon numarası zorunludur")
    @Pattern(
        regexp = "^\\+90\\s?5\\d{2}\\s?\\d{3}\\s?\\d{2}\\s?\\d{2}$",
        message = "Telefon numarası +90 5xx xxx xx xx formatında olmalı"
    )
    private String phoneNumber;

    @JsonProperty
    @NotBlank(message = "E-posta zorunludur")
    @Email(message = "Geçerli bir e-posta girin")
    @Size(max = 255, message = "E-posta 255 karakteri geçemez")
    private String email;

    @JsonProperty
    @NotBlank(message = "Vergi numarası zorunludur")
    @Pattern(regexp = "^\\d{10}$", message = "Vergi numarası 10 haneli rakamlardan oluşmalıdır")
    private String taxId;

    @JsonProperty
    @NotBlank(message = "Adres zorunludur")
    @Size(max = 200, message = "Adres 200 karakteri geçemez")
    @Column(length = 200)
    private String address;

    @JsonProperty
    @Column(length = 16)
    @Pattern(regexp = "^$|^[A-Za-z0-9]{1,16}$", message = "Referans kodu sadece harf/rakam ve en fazla 16 karakter olabilir")
    private String referenceCode;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private int status = 0; // 1=aktif, 0=pasif

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_followers",
        joinColumns = @JoinColumn(name = "follower_id"),
        inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    @JsonIgnore
    private Set<User> following = new HashSet<>();
    
    @ManyToMany(mappedBy = "following", fetch = FetchType.LAZY)
    @JsonIgnore
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
        return status == 1;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id != null && id.equals(user.getId());
    }

    @Override
    public int hashCode() {
        return 31;
    }
}
