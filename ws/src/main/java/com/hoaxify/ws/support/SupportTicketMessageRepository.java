package com.hoaxify.ws.support;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportTicketMessageRepository extends JpaRepository<SupportTicketMessage, Long> {

    List<SupportTicketMessage> findByTicketOrderByCreatedAtAsc(SupportTicket ticket);
}
