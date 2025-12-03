package com.hoaxify.admin.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
}
