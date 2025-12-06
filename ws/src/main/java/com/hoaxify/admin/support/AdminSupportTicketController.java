package com.hoaxify.admin.support;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.support.SupportTicketService;
import com.hoaxify.ws.support.SupportTicketStatus;
import com.hoaxify.ws.support.SupportTicketType;
import com.hoaxify.ws.support.dto.SupportTicketDetailVM;
import com.hoaxify.ws.support.dto.SupportTicketMessageRequest;
import com.hoaxify.ws.support.dto.SupportTicketMessageVM;
import com.hoaxify.ws.support.dto.SupportTicketStatusUpdateRequest;
import com.hoaxify.ws.support.dto.SupportTicketVM;
import com.hoaxify.ws.user.User;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/1.0/support")
public class AdminSupportTicketController {

    private final SupportTicketService supportTicketService;

    public AdminSupportTicketController(SupportTicketService supportTicketService) {
        this.supportTicketService = supportTicketService;
    }

    @GetMapping("/tickets")
    public Page<SupportTicketVM> listTickets(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) SupportTicketStatus status,
            @RequestParam(value = "type", required = false) SupportTicketType type,
            @PageableDefault(sort = "updatedAt", direction = Direction.DESC) Pageable pageable,
            @CurrentUserAnnotation User currentUser) {
        return supportTicketService.listForAdmin(search, status, type, pageable, currentUser);
    }

    @GetMapping("/tickets/{id}")
    public SupportTicketDetailVM getTicket(
            @PathVariable Long id,
            @CurrentUserAnnotation User currentUser) {
        return supportTicketService.getTicket(id, currentUser);
    }

    @PutMapping("/tickets/{id}/status")
    public SupportTicketVM updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody SupportTicketStatusUpdateRequest request,
            @CurrentUserAnnotation User currentUser) {
        return supportTicketService.updateStatus(id, request, currentUser);
    }

    @PostMapping("/tickets/{id}/messages")
    public SupportTicketMessageVM addAdminMessage(
            @PathVariable Long id,
            @Valid @RequestBody SupportTicketMessageRequest request,
            @CurrentUserAnnotation User currentUser) {
        return supportTicketService.addMessage(id, request, currentUser);
    }
}
