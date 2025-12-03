package com.hoaxify.admin.user;

import java.time.LocalDateTime;

import com.hoaxify.ws.user.User;

import lombok.Data;

@Data
public class AdminUserVM {

    private Long id;
    private String username;
    private String displayName;
    private String email;
    private String phoneNumber;
    private String address;
    private int status;
    private LocalDateTime createDate;

    public AdminUserVM(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.displayName = user.getDisplayName();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.address = user.getAddress();
        this.status = user.getStatus();
        this.createDate = user.getCreateDate();
    }
}
