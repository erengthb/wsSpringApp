package com.hoaxify.ws.support;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hoaxify.admin.AdminAccessDeniedException;
import com.hoaxify.ws.error.NotFoundException;
import com.hoaxify.ws.support.dto.SupportTicketCreateRequest;
import com.hoaxify.ws.support.dto.SupportTicketDetailVM;
import com.hoaxify.ws.support.dto.SupportTicketMessageRequest;
import com.hoaxify.ws.support.dto.SupportTicketMessageVM;
import com.hoaxify.ws.support.dto.SupportTicketStatusUpdateRequest;
import com.hoaxify.ws.support.dto.SupportTicketVM;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.utils.DateUtil;

@Service
public class SupportTicketService {

    private final SupportTicketRepository ticketRepository;
    private final SupportTicketMessageRepository messageRepository;
    private final com.hoaxify.ws.notification.NotificationService notificationService;

    public SupportTicketService(SupportTicketRepository ticketRepository,
                                SupportTicketMessageRepository messageRepository,
                                com.hoaxify.ws.notification.NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public SupportTicketDetailVM createTicket(SupportTicketCreateRequest request, User currentUser) {
        if (currentUser == null) {
            throw new AccessDeniedException("Giris yapmaniz gerekiyor");
        }
        SupportTicket ticket = new SupportTicket();
        ticket.setTitle(request.getTitle());
        ticket.setType(request.getType());
        ticket.setStatus(SupportTicketStatus.OPEN);
        ticket.setCreatedBy(currentUser);
        ticket.setCreatedAt(DateUtil.getCurrentLocalDateTime());
        ticket.setUpdatedAt(ticket.getCreatedAt());

        SupportTicketMessage firstMessage = new SupportTicketMessage();
        firstMessage.setTicket(ticket);
        firstMessage.setAuthor(currentUser);
        firstMessage.setFromAdmin(false);
        firstMessage.setMessage(request.getMessage());
        firstMessage.setCreatedAt(DateUtil.getCurrentLocalDateTime());

        ticket.getMessages().add(firstMessage);
        ticket.setLastCommentAt(firstMessage.getCreatedAt());

        SupportTicket saved = ticketRepository.save(ticket);
        List<SupportTicketMessage> messages = messageRepository.findByTicketOrderByCreatedAtAsc(saved);
        return new SupportTicketDetailVM(saved, messages);
    }

    @Transactional(readOnly = true)
    public Page<SupportTicketVM> listMyTickets(User currentUser, SupportTicketStatus status, Pageable pageable) {
        Page<SupportTicket> page;
        if (status != null) {
            page = ticketRepository.findByCreatedByAndStatus(currentUser, status, pageable);
        } else {
            page = ticketRepository.findByCreatedBy(currentUser, pageable);
        }
        return page.map(SupportTicketVM::new);
    }

    @Transactional(readOnly = true)
    public Page<SupportTicketVM> listForAdmin(String search, SupportTicketStatus status, SupportTicketType type, Pageable pageable, User currentUser) {
        ensureAdmin(currentUser);
        return ticketRepository.searchForAdmin(search, status, type, pageable).map(SupportTicketVM::new);
    }

    @Transactional(readOnly = true)
    public SupportTicketDetailVM getTicket(Long id, User currentUser) {
        SupportTicket ticket = ticketRepository.findById(id).orElseThrow(NotFoundException::new);
        ensureOwnerOrAdmin(currentUser, ticket);
        List<SupportTicketMessage> messages = messageRepository.findByTicketOrderByCreatedAtAsc(ticket);
        return new SupportTicketDetailVM(ticket, messages);
    }

    @Transactional
    public SupportTicketMessageVM addMessage(Long ticketId, SupportTicketMessageRequest request, User currentUser) {
        SupportTicket ticket = ticketRepository.findById(ticketId).orElseThrow(NotFoundException::new);
        ensureOwnerOrAdmin(currentUser, ticket);
        if (ticket.getStatus() == SupportTicketStatus.RESOLVED) {
            throw new AccessDeniedException("Çözülen taleplere yanıt verilemez");
        }

        SupportTicketMessage message = new SupportTicketMessage();
        message.setTicket(ticket);
        message.setAuthor(currentUser);
        message.setMessage(request.getMessage());
        message.setFromAdmin(isAdmin(currentUser));
        message.setCreatedAt(DateUtil.getCurrentLocalDateTime());

        ticket.getMessages().add(message);
        ticket.setUpdatedAt(message.getCreatedAt());
        ticket.setLastCommentAt(message.getCreatedAt());
        ticketRepository.save(ticket);

        if (message.isFromAdmin()) {
            notificationService.createSupportMessageNotification(
                    ticket.getCreatedBy(), currentUser, ticket.getId(), "Destek talebi #" + ticket.getId() + " icin yanit");
        }

        return new SupportTicketMessageVM(message);
    }

    @Transactional
    public SupportTicketVM updateStatus(Long ticketId, SupportTicketStatusUpdateRequest request, User currentUser) {
        ensureAdmin(currentUser);
        SupportTicket ticket = ticketRepository.findById(ticketId).orElseThrow(NotFoundException::new);
        ticket.setStatus(request.getStatus());
        ticket.setUpdatedAt(DateUtil.getCurrentLocalDateTime());
        ticketRepository.save(ticket);
        notificationService.createSupportStatusNotification(
                ticket.getCreatedBy(), currentUser, ticket.getId(), request.getStatus().name());
        return new SupportTicketVM(ticket);
    }

    private void ensureOwnerOrAdmin(User currentUser, SupportTicket ticket) {
        if (currentUser == null) {
            throw new AccessDeniedException("Talep yetkisi bulunamadi");
        }
        if (isAdmin(currentUser)) {
            return;
        }
        if (!ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Talebi gormek icin yetkiniz yok");
        }
    }

    private void ensureAdmin(User currentUser) {
        if (!isAdmin(currentUser)) {
            throw new AdminAccessDeniedException();
        }
    }

    private boolean isAdmin(User user) {
        return user != null && "admin".equalsIgnoreCase(user.getUsername());
    }
}
