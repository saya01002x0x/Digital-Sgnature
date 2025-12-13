package sis.hust.edu.vn.digital_signature.exception.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import sis.hust.edu.vn.digital_signature.dto.common.response.Response;
import sis.hust.edu.vn.digital_signature.exception.business.BusinessException;
import sis.hust.edu.vn.digital_signature.exception.entity.EntityNotFoundException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    @Value("${frontend.url:http://localhost:5556}")
    private String frontendUrl;

    @Value("${frontend.login-path:/login}")
    private String loginPath;

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Response<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        Response<Map<String, String>> response = Response.<Map<String, String>>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed")
                .data(errors)
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Response<Object>> handleEntityNotFoundException(
            EntityNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Response<Object>> handleBusinessException(
            BusinessException ex) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Response<Map<String, String>>> handleAuthenticationException(
            AuthenticationException ex) {
        Map<String, String> data = new HashMap<>();
        data.put("redirectUrl", frontendUrl + loginPath);
        data.put("message", "Authentication failed: " + ex.getMessage());
        
        Response<Map<String, String>> response = Response.<Map<String, String>>builder()
                .status(401)
                .message("Authentication failed")
                .data(data)
                .build();
        
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .header("X-Redirect-Url", frontendUrl + loginPath)
                .body(response);
    }

    @ExceptionHandler(AuthenticationCredentialsNotFoundException.class)
    public ResponseEntity<Response<Map<String, String>>> handleAuthenticationCredentialsNotFoundException(
            AuthenticationCredentialsNotFoundException ex) {
        Map<String, String> data = new HashMap<>();
        data.put("redirectUrl", frontendUrl + loginPath);
        data.put("message", "Authentication required");
        
        Response<Map<String, String>> response = Response.<Map<String, String>>builder()
                .status(401)
                .message("Authentication required")
                .data(data)
                .build();
        
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .header("X-Redirect-Url", frontendUrl + loginPath)
                .body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Response<Object>> handleAccessDeniedException(
            AccessDeniedException ex) {
        return buildError(HttpStatus.FORBIDDEN, "Access denied: " + ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Response<Object>> handleIllegalArgumentException(
            IllegalArgumentException ex) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Response<Object>> handleRuntimeException(
            RuntimeException ex) {
        log.error("Runtime exception occurred", ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Response<Object>> handleGenericException(
            Exception ex) {
        log.error("Unexpected exception occurred", ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }

    @ExceptionHandler(Throwable.class)
    public ResponseEntity<Response<Object>> handleAllThrowable(Throwable ex) {
        log.error("Unhandled throwable caught", ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }

    private ResponseEntity<Response<Object>> buildError(HttpStatus status, String message) {
        return ResponseEntity
                .status(status)
                .body(Response.error(status.value(), message));
    }
}


