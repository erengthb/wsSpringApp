package com.hoaxify.ws.user.vm;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateVM {

    @NotNull
    @Size(min = 3, max = 255)
    private String displayName;

    private String image; // Base64 image string

    @Size(min = 10, max = 20)
    private String phoneNumber;

    @Email
    private String email;

    @Column(length = 255)
    private String address;

 
}
