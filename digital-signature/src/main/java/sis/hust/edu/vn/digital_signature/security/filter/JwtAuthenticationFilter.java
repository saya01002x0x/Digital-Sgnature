package sis.hust.edu.vn.digital_signature.security.filter;

import lombok.extern.slf4j.Slf4j;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import sis.hust.edu.vn.digital_signature.repository.user.UserRepository;
import sis.hust.edu.vn.digital_signature.security.context.UserContext;
import sis.hust.edu.vn.digital_signature.security.jwt.JwtService;
import sis.hust.edu.vn.digital_signature.security.service.CustomUserDetailsService;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final UserContext userContext;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.info("No Bearer token found in request: {}", request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwt = authHeader.substring(7);
            userEmail = jwtService.extractUsername(jwt);
            log.info("Extracted username from token: {}", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtService.isTokenValid(jwt)) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                    log.info("Loaded user details for: {}, Authorities: {}", userEmail, userDetails.getAuthorities());

                    userRepository.findByUsername(userEmail).ifPresent(user -> {
                        userContext.setCurrentUser(user);
                        log.info("Set UserContext for user: {}", user.getUsername());
                    });

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("Authentication set in SecurityContext for: {}", userEmail);
                } else {
                    log.warn("Token is invalid for user: {}", userEmail);
                }
            } else {
                 log.info("Username is null or Context already auth: username={}, context={}", userEmail, SecurityContextHolder.getContext().getAuthentication());
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }
}


