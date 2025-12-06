package com.hoaxify.ws.support.dto;

import java.time.LocalDateTime;

import com.hoaxify.ws.support.SupportTicketMessage;

import lombok.Data;

@Data
public class SupportTicketMessageVM {
    private Long id;
    private String message;
    private boolean fromAdmin;
    private LocalDateTime createdAt;
    private SupportTicketUserVM author;

    public SupportTicketMessageVM(SupportTicketMessage message) {
        this.id = message.getId();
        this.message = message.getMessage();
        this.fromAdmin = message.isFromAdmin();
        this.createdAt = message.getCreatedAt();
        this.author = new SupportTicketUserVM(message.getAuthor());
    }
}
