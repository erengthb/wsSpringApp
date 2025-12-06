package com.hoaxify.ws.support.dto;

import com.hoaxify.ws.user.User;

import lombok.Data;

@Data
public class SupportTicketUserVM {
    private Long id;
    private String username;
    private String displayName;

    public SupportTicketUserVM(User user) {
        if (user != null) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.displayName = user.getDisplayName();
        }
    }
}
