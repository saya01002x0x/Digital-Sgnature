package sis.hust.edu.vn.digital_signature.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import sis.hust.edu.vn.digital_signature.constants.PaginationConstants;

public class PaginationUtils {

    public static Pageable createPageable(Integer page, Integer size, String sortBy, String sortDirection) {
        int pageNumber = page != null && page >= 0 ? page : PaginationConstants.DEFAULT_PAGE;
        int pageSize = size != null && size > 0 && size <= PaginationConstants.MAX_SIZE 
                ? size 
                : PaginationConstants.DEFAULT_SIZE;
        
        String sortField = sortBy != null && !sortBy.isBlank() 
                ? sortBy 
                : PaginationConstants.DEFAULT_SORT_BY;
        
        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection) 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;
        
        Sort sort = Sort.by(direction, sortField);
        
        return PageRequest.of(pageNumber, pageSize, sort);
    }

    public static Pageable createPageable(Integer page, Integer size) {
        return createPageable(page, size, null, null);
    }

    public static Pageable createDefaultPageable() {
        return createPageable(null, null, null, null);
    }
}

