package com.hoaxify.ws.support.dto;

import com.hoaxify.ws.support.SupportTicketType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SupportTicketCreateRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotNull
    private SupportTicketType type;

    @NotBlank
    @Size(max = 2000)
    private String message;
}
