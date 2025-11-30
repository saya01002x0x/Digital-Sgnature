package sis.hust.edu.vn.digital_signature.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import sis.hust.edu.vn.digital_signature.security.context.UserContext;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Order(Ordered.LOWEST_PRECEDENCE)
public class UserContextCleanupFilter extends OncePerRequestFilter {

    private final UserContext userContext;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } finally {
            userContext.clear();
        }
    }
}


