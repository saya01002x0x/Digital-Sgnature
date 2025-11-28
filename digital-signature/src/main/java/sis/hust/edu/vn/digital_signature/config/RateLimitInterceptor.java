package sis.hust.edu.vn.digital_signature.config;

import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitConfig rateLimitConfig;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!rateLimitConfig.isEnabled()) {
            return true;
        }

        String path = request.getRequestURI();
        if (path.startsWith("/actuator") || 
            path.startsWith("/api-docs") || 
            path.startsWith("/swagger-ui")) {
            return true;
        }

        String clientId = getClientId(request);
        Bucket bucket = rateLimitConfig.resolveBucket(clientId);

        if (bucket.tryConsume(1)) {
            return true;
        } else {
            log.warn("Rate limit exceeded for client: {}", clientId);
            sendErrorResponse(response, HttpStatus.TOO_MANY_REQUESTS.value(), "Too many requests. Please try again later.");
            return false;
        }
    }

    private String getClientId(HttpServletRequest request) {
        String username = request.getUserPrincipal() != null 
            ? request.getUserPrincipal().getName() 
            : null;
        
        if (username != null) {
            return username;
        }
        
        String ipAddress = getClientIpAddress(request);
        return "ip:" + ipAddress;
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
            String.format("{\"status\":\"error\",\"message\":\"%s\",\"code\":%d}", message, status)
        );
    }
}

