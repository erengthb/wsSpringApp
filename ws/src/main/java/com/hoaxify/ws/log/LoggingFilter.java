package com.hoaxify.ws.log;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Component
public class LoggingFilter implements Filter {

    @Autowired
    private LogRecordRepository logRecordRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;

        String path = httpServletRequest.getRequestURI();
        if (!path.startsWith("/api/")) {
            chain.doFilter(request, response);
            return;
        }

        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(httpServletRequest);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(httpServletResponse);

        long start = System.currentTimeMillis();
        Exception exceptionCaught = null;

        try {
            chain.doFilter(wrappedRequest, wrappedResponse);
        } catch (Exception ex) {
            exceptionCaught = ex;
        }

        long duration = System.currentTimeMillis() - start;

        String requestBody = getContent(wrappedRequest.getContentAsByteArray());
        String rawResponseBody = getContent(wrappedResponse.getContentAsByteArray());
        String sanitizedResponseBody = sanitizeResponseBody(rawResponseBody);
        String username = resolveUsername();

        LogRecord log = new LogRecord();
        log.setMethod(wrappedRequest.getMethod());
        log.setUri(wrappedRequest.getRequestURI());
        log.setRequestBody(requestBody);
        log.setResponseBody(exceptionCaught != null ? exceptionCaught.toString() : sanitizedResponseBody);
        log.setStatus(exceptionCaught != null ? 500 : wrappedResponse.getStatus());
        log.setDuration(duration);
        log.setTimestamp(LocalDateTime.now());
        log.setRemoteAddress(request.getRemoteAddr());
        log.setUsername(username);

        logRecordRepository.save(log);

        wrappedResponse.copyBodyToResponse();

        if (exceptionCaught != null) {
            if (exceptionCaught instanceof ServletException) {
                throw (ServletException) exceptionCaught;
            } else if (exceptionCaught instanceof IOException) {
                throw (IOException) exceptionCaught;
            } else {
                throw new ServletException(exceptionCaught);
            }
        }
    }

    private String getContent(byte[] buf) {
        if (buf == null || buf.length == 0) {
            return "";
        }
        return new String(buf, StandardCharsets.UTF_8);
    }

    /**
     * Response JSON'daki "image" veya "profileImage" field'ı siler.
     */
    private String sanitizeResponseBody(String responseBody) {
        if (responseBody == null || responseBody.isEmpty()) {
            return "";
        }
        try {
            ObjectNode node = (ObjectNode) objectMapper.readTree(responseBody);
            node.remove("image");
            node.remove("profileImage");
            return objectMapper.writeValueAsString(node);
        } catch (Exception e) {
            // JSON parse edilemezse orijinal haliyle döner
            return responseBody;
        }
    }

    private String resolveUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        return auth.getName();
    }

}
