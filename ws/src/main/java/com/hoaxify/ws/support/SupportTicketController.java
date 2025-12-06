package com.hoaxify.ws.support;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.support.dto.SupportTicketCreateRequest;
import com.hoaxify.ws.support.dto.SupportTicketDetailVM;
import com.hoaxify.ws.support.dto.SupportTicketMessageRequest;
import com.hoaxify.ws.support.dto.SupportTicketMessageVM;
import com.hoaxify.ws.support.dto.SupportTicketVM;
import com.hoaxify.ws.user.User;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/1.0/support")
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    public SupportTicketController(SupportTicketService supportTicketService) {
        this.supportTicketService = supportTicketService;
    }

    @PostMapping("/tickets")
    public SupportTicketDetailVM createTicket(
            @Valid @RequestBody SupportTicketCreateRequest request,
            @CurrentUserAnnotation User currentUser) {
        return supportTicketService.createTicket(request, currentUser);
    }

    @GetMapping("/tickets")
    public Page<SupportTicketVM> listMyTickets(
            @RequestParam(value = "status", required = false) SupportTicketStatus status,
            @PageableDefault(sort = "updatedAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable,
            @CurrentUserAnnotation User currentUser) {
        return supportTicketService.listMyTickets(currentUser, status, pageable);
    }

    @GetMapping("/tickets/{id}")
    public SupportTicketDetailVM getTicket(
            @PathVariable Long id,
            @CurrentUserAnnotation User currentUser) {
        return supportTicketService.getTicket(id, currentUser);
    }

    @PostMapping("/tickets/{id}/messages")
    public SupportTicketMessageVM addMessage(
            @PathVariable Long id,
            @Valid @RequestBody SupportTicketMessageRequest request,
            @CurrentUserAnnotation User currentUser) {
        return supportTicketService.addMessage(id, request, currentUser);
    }
}
