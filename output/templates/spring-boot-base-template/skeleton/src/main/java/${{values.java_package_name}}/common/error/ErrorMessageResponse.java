package ${{values.java_package_name| replace("/", ".")}}.common.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorMessageResponse {
    private int httpCode;
    private String httpName;
    private String errorCode;
    private String message;
    private String exception;
    private String stackTrace;
    private Map<String, String> errors;
}
