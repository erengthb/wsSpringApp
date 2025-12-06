package com.hoaxify.ws.support;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class SupportTicketStatusConverter implements AttributeConverter<SupportTicketStatus, String> {

    @Override
    public String convertToDatabaseColumn(SupportTicketStatus attribute) {
        return attribute != null ? attribute.name() : null;
    }

    @Override
    public SupportTicketStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return SupportTicketStatus.OPEN;
        }
        try {
            return SupportTicketStatus.valueOf(dbData);
        } catch (IllegalArgumentException ex) {
            // Eski/CLOSED vb. değerleri güvenli şekilde ÇÖZÜLDÜ olarak ele al
            if ("CLOSED".equalsIgnoreCase(dbData)) {
                return SupportTicketStatus.RESOLVED;
            }
            // Bilinmeyen durumlarda listeleyebilmek için Açık'a düş
            return SupportTicketStatus.OPEN;
        }
    }
}
