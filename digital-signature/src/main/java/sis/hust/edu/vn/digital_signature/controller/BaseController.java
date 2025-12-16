package sis.hust.edu.vn.digital_signature.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import sis.hust.edu.vn.digital_signature.dto.common.response.PageResponse;
import sis.hust.edu.vn.digital_signature.dto.common.response.Response;

public abstract class BaseController {

    protected <T> ResponseEntity<Response<T>> success(T data) {
        return ResponseEntity.ok(Response.success(data));
    }

    protected <T> ResponseEntity<Response<T>> success(String message, T data) {
        return ResponseEntity.ok(Response.success(message, data));
    }

    protected <T> ResponseEntity<Response<T>> created(T data) {
        return ResponseEntity.status(201).body(Response.success("Created successfully", data));
    }

    protected <T> ResponseEntity<Response<T>> created(String message, T data) {
        return ResponseEntity.status(201).body(Response.success(message, data));
    }

    protected <T> ResponseEntity<PageResponse<T>> successPage(Page<T> page) {
        return ResponseEntity.ok(PageResponse.success(page));
    }

    protected <T> ResponseEntity<PageResponse<T>> successPage(String message, Page<T> page) {
        return ResponseEntity.ok(PageResponse.success(message, page));
    }

    protected <T> ResponseEntity<Response<T>> badRequest(String message) {
        return ResponseEntity.badRequest().body(Response.error(message));
    }
}

