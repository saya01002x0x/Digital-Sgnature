package sis.hust.edu.vn.digital_signature.entity.enums;

public enum OtpType {
    REGISTER,
    FORGOT_PASSWORD;

    @com.fasterxml.jackson.annotation.JsonCreator
    public static OtpType fromValue(String value) {
        if (value == null) {
            return null;
        }
        return OtpType.valueOf(value.toUpperCase());
    }
}
