package com.hoaxify.ws.support.dto;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Optional;

import com.hoaxify.ws.support.SupportTicket;
import com.hoaxify.ws.support.SupportTicketMessage;
import com.hoaxify.ws.support.SupportTicketStatus;
import com.hoaxify.ws.support.SupportTicketType;

import lombok.Data;

@Data
public class SupportTicketVM {
    private Long id;
    private String title;
    private SupportTicketType type;
    private SupportTicketStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastCommentAt;
    private SupportTicketUserVM createdBy;
    private SupportTicketMessageVM lastMessage;

    public SupportTicketVM(SupportTicket ticket) {
        this.id = ticket.getId();
        this.title = ticket.getTitle();
        this.type = ticket.getType();
        this.status = ticket.getStatus();
        this.createdAt = ticket.getCreatedAt();
        this.updatedAt = ticket.getUpdatedAt();
        this.lastCommentAt = ticket.getLastCommentAt();
        this.createdBy = new SupportTicketUserVM(ticket.getCreatedBy());

        Optional<SupportTicketMessage> lastMsg = ticket.getMessages()
                .stream()
                .max(Comparator.comparing(SupportTicketMessage::getCreatedAt));
        lastMsg.ifPresent(m -> this.lastMessage = new SupportTicketMessageVM(m));
    }
}
