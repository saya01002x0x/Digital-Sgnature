package sis.hust.edu.vn.digital_signature.config.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@Slf4j
public class LoggingInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (shouldLog(request)) {
            log.info("Request: {} {} from {}", request.getMethod(), request.getRequestURI(), request.getRemoteAddr());
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        if (shouldLog(request)) {
            log.info("Response: {} {} - Status: {}", request.getMethod(), request.getRequestURI(), response.getStatus());
        }
    }

    private boolean shouldLog(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return !uri.startsWith("/actuator") && !uri.startsWith("/swagger-ui") && !uri.startsWith("/api-docs");
    }
}


