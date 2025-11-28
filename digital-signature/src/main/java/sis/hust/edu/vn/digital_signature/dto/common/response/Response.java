package sis.hust.edu.vn.digital_signature.dto.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Response<T> {

    private Integer status;

    private String message;

    private T data;

    public static <T> Response<T> success(T data) {
        return Response.<T>builder()
                .status(200)
                .message("Success")
                .data(data)
                .build();
    }

    public static <T> Response<T> success(String message, T data) {
        return Response.<T>builder()
                .status(200)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> Response<T> error(Integer status, String message) {
        return Response.<T>builder()
                .status(status)
                .message(message)
                .data(null)
                .build();
    }

    public static <T> Response<T> error(String message) {
        return Response.<T>builder()
                .status(500)
                .message(message)
                .data(null)
                .build();
    }
}

