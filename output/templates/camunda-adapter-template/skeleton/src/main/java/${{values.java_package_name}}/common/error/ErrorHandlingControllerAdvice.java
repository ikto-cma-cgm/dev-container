package ${{values.java_package_name| replace("/", ".")}}.common.error;

import io.camunda.zeebe.model.bpmn.BpmnModelException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * ControllerAdvice class for handling various exception types thrown in all rest controller services.
 * Allows a mapping of Exception types to HttpCodes and response object variations.
 */
@RestControllerAdvice
public class ErrorHandlingControllerAdvice {

    // If true, error response object will contain exception type field. Default true
    @Value("${restErrors.showExceptionType:true}")
    private boolean SHOW_EXCEPTION_TYPE;

    /**
     * If true, error response object will contain stacktrace of error, default false.
     * Use only for development.
     */
    @Value("${restErrors.showStackTrace:false}")
    private boolean SHOW_STACK_TRACE;

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    ResponseEntity<ErrorMessageResponse> onConstraintValidationException(
            ConstraintViolationException e) {

        Map<String, String> errors = new HashMap<>();
        for (ConstraintViolation<?> violation : e.getConstraintViolations().stream().toList()) {
            errors.put(violation.getPropertyPath().toString(), violation.getMessage());
        }
        HttpStatus status = HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(
                generateResponse(status, e, errors), new HttpHeaders(), status);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    ResponseEntity<ErrorMessageResponse> onMethodArgumentNotValidException(
            MethodArgumentNotValidException e) {

        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        HttpStatus status = HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(
                generateResponse(status, e, errors), new HttpHeaders(), status);
    }

    @ExceptionHandler(NotImplementedException.class)
    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
    @ResponseBody
    ResponseEntity<ErrorMessageResponse> onNotImplementedException(
            NotImplementedException e) {

        HttpStatus status = HttpStatus.NOT_IMPLEMENTED;
        return new ResponseEntity<>(
                generateResponse(status, e), new HttpHeaders(), status);
    }

    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ResponseBody
    ResponseEntity<ErrorMessageResponse> onIllegalStateException(
            IllegalStateException e) {

        HttpStatus status = HttpStatus.UNPROCESSABLE_ENTITY;
        return new ResponseEntity<>(
                generateResponse(status, e), new HttpHeaders(), status);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    ResponseEntity<ErrorMessageResponse> onIllegalArgumentException(
            IllegalArgumentException e) {

        HttpStatus status = HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(
                generateResponse(status, e), new HttpHeaders(), status);
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    ResponseEntity<ErrorMessageResponse> onValidationException(
            ValidationException e) {

        HttpStatus status = HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(
                generateResponse(status, e), new HttpHeaders(), status);
    }

    @ExceptionHandler(AuthorizationServiceException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    ResponseEntity<ErrorMessageResponse> onAuthorizationException(
            AuthorizationServiceException e) {

        HttpStatus status = HttpStatus.FORBIDDEN;
        return new ResponseEntity<>(
                generateResponse(status, e), new HttpHeaders(), status);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    ResponseEntity<ErrorMessageResponse> onMessageNotReadableException(
            HttpMessageNotReadableException e) {

        HttpStatus status = HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(
                generateResponse(status, e), new HttpHeaders(), status);
    }

    /**
     * This handler represents a general exception type for business errors.
     * Chose one exception type as base for all business errors and handle it with this ExceptionHandler,
     * here BpmnModelException is shown as example. It will allow to respond with 422 UNPROCESSABLE_ENTITY Code
     * in all business error cases.
     */
    @ExceptionHandler(BpmnModelException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ResponseBody
    ResponseEntity<ErrorMessageResponse> onBpmnModelException(
            BpmnModelException e) {

        HttpStatus status = HttpStatus.UNPROCESSABLE_ENTITY;
        return new ResponseEntity<>(
                generateResponse(status, e), new HttpHeaders(), status);
    }

    /**
     * Creates a MessageResponse based on error type, configuration variables. Used for errors with one message only.
     *
     * @param status HttpStatus code of the error
     * @param e Exception that was throws and we show error for
     * @return ErrorMessageResponse object to be returned as error response
     */
    private ErrorMessageResponse generateResponse(HttpStatus status, Exception e) {
        return generateResponse(status, e, null);
    }

    /**
     * Creates a MessageResponse based on error type, configuration variables and a list of provided errors
     * if there are more than one.
     *
     * @param status HttpStatus code of the error
     * @param e Exception that was throws and we show error for
     * @param errors A map of errors as key,value pairs to show more than one error like in case of payload validations
     * @return ErrorMessageResponse object to be returned as error response
     */
    private ErrorMessageResponse generateResponse(HttpStatus status, Exception e, Map<String,String> errors) {
        ErrorMessageResponse message = new ErrorMessageResponse();
        message.setHttpCode(status.value());
        message.setHttpName(status.name());
        message.setMessage(e.getMessage());
        if (SHOW_EXCEPTION_TYPE) {
            message.setException(e.getClass().getSimpleName());
        }
        if (SHOW_STACK_TRACE) {
            message.setStackTrace(Arrays.toString(e.getStackTrace()));
        }
        // Add individual Errors in case of exceptions with details
        if (Objects.nonNull(errors)) {
            message.setErrors(errors);
            message.setMessage("Request validation error");
        }
        return message;
    }

}
