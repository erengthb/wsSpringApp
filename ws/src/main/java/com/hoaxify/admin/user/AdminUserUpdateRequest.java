package com.hoaxify.admin.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminUserUpdateRequest {

    @Size(min = 4, max = 255)
    private String displayName;

    @Size(max = 20)
    private String phoneNumber;

    @Email
    @Size(max = 255)
    private String email;

    @Size(max = 255)
    private String address;

    @Min(0)
    @Max(1)
    private Integer status;

    @Size(max = 50)
    private String taxId;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{hoaxify.constraint.password.Pattern.message}")
    @Size(min = 8, max = 100)
    private String password;
}
