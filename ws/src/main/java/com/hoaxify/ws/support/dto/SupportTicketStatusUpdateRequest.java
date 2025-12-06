package com.hoaxify.ws.support.dto;

import com.hoaxify.ws.support.SupportTicketStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SupportTicketStatusUpdateRequest {

    @NotNull
    private SupportTicketStatus status;
}
