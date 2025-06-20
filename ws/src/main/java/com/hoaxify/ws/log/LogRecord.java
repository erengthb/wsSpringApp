package com.hoaxify.ws.log;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "LOGS")
@Data
public class LogRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String method;
    private String uri;
    private String remoteAddress;
    private int status;
    private long duration;
    private LocalDateTime timestamp;

    @Lob
    private String requestBody;

    @Lob
    private String responseBody;

}
