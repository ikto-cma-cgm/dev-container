package ${{values.java_package_name| replace("/", ".")}}.booking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingCancellation;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingConfirmation;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingRequest;
import ${{values.java_package_name| replace("/", ".")}}.booking.services.SampleWorkflowCommandService;

import lombok.RequiredArgsConstructor;

import java.util.Objects;

/**
 * This is an example of how we can expose our Camunda adapter capability using HTTP endpoints
 * the endpoint below is not really a REST endpoint but it is there for sake of example/templayte
 */
@RestController()
@RequestMapping("/booking")
@RequiredArgsConstructor
//@PreAuthorize(PreAuthorizeAuthority.MY_AUTHORITY)
public class SampleBookingController {

    private final SampleWorkflowCommandService workflowCommandService;

    /**
     * Initiates the BPMN process. Returns http 200 when successful.
     *
     * @param bookingRequest Body of process starting Event
     */
    @PostMapping("/workflow/start")
    public ResponseEntity<ProcessInstanceResponse> newBookingRequest(@RequestBody SampleBookingRequest bookingRequest) {
        var instance = this.workflowCommandService.sendBookingRequest(bookingRequest);
        // Basic mapping for process instance information.
        var response = new ProcessInstanceResponse();
        if(Objects.nonNull(instance)) {
            response.setProcessDefinitionKey(instance.getProcessDefinitionKey());
            response.setBpmnProcessId(instance.getBpmnProcessId());
            response.setProcessVersion(instance.getVersion());
            response.setProcessInstanceKey(instance.getProcessInstanceKey());
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Triggers a bpmn process event: cancellation with event body.
     * Returns http 202 when successful.
     *
     * @param bookingCancellation Body of an event
     */
    @PostMapping("/workflow/event/cancellation")
    public ResponseEntity<Void> cancelRequest(@RequestBody  SampleBookingCancellation bookingCancellation){
        this.workflowCommandService.sendCancellation(bookingCancellation);
        return ResponseEntity.accepted().build();
    }

    /**
     * Triggers a bpmn process event: confirmation with event body.
     * Returns http 202 when successful.
     *
     * @param bookingConfirmation Body of an event
     */
    @PostMapping("/workflow/event/confirmation")
    public ResponseEntity<Void> confirmRequest(@RequestBody  SampleBookingConfirmation bookingConfirmation){
        this.workflowCommandService.sendConfirmation(bookingConfirmation);
        return ResponseEntity.accepted().build();
    }

}
