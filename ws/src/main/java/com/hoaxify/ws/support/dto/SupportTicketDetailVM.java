package com.hoaxify.ws.support.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.hoaxify.ws.support.SupportTicket;
import com.hoaxify.ws.support.SupportTicketMessage;

public class SupportTicketDetailVM extends SupportTicketVM {

    private List<SupportTicketMessageVM> messages;

    public SupportTicketDetailVM(SupportTicket ticket, List<SupportTicketMessage> messageList) {
        super(ticket);
        this.messages = messageList.stream().map(SupportTicketMessageVM::new).collect(Collectors.toList());
    }

    public List<SupportTicketMessageVM> getMessages() {
        return messages;
    }
}
