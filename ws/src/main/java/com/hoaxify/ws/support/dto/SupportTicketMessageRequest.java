package com.hoaxify.ws.support.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SupportTicketMessageRequest {

    @NotBlank
    @Size(max = 2000)
    private String message;
}
