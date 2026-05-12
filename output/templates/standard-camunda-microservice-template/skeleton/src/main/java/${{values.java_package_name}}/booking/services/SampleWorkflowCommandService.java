package ${{values.java_package_name| replace("/", ".")}}.booking.services;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingCancellation;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingConfirmation;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingRequest;
import ${{values.java_package_name| replace("/", ".")}}.common.constants.SampleBpmnConstants;
import java.util.Map;
import org.springframework.stereotype.Component;
import io.camunda.client.api.response.ProcessInstanceEvent;
import io.camunda.client.CamundaClient;
import io.camunda.client.api.response.PublishMessageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service to interact and send command to camunda
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SampleWorkflowCommandService {

    private final CamundaClient camundaClient;

    private final static String APP_NAME = "camunda-adapter-template";
    private final static String FUNCTIONAL_NAME = "booking";

    /**
     * Booking confirmation BPMN Message ID
     */
    public final static String BOOKING_CONFIRMATION_BPMN_MESSAGE_ID = getBpmnMessageId("confirmation");

    /**
     * Booking Cancellation BPMN Message ID
     */
    public final static String BOOKING_CANCELLATION_BPMN_MESSAGE_ID = getBpmnMessageId("cancellation");

    private static String getBpmnMessageId(final String eventName) {
        return APP_NAME + "." + FUNCTIONAL_NAME + "-process.event." + FUNCTIONAL_NAME + eventName;
    }

    private static String getContextVariableName(final String eventName) {
        return FUNCTIONAL_NAME + "-" + eventName + "-event";
    }

    /**
     * Send booking confirmation logic. Trigger BPMN process event for booking confirmation.
     * BPMN Event Triggers always need a proper correlation ID to properly identify process instance where the event
     * is to be triggered.
     *
     * @param bookingConfirmation Contents of the booking confirmation event
     */
    public void sendConfirmation(SampleBookingConfirmation bookingConfirmation) {
        log.info("Booking Confirmation event to be sent to camunda");
        sendEventMessage(BOOKING_CONFIRMATION_BPMN_MESSAGE_ID, String.format("booking-%s", bookingConfirmation.getBookingRef()),
                Map.of(getContextVariableName("confirmation"), bookingConfirmation));
    }

    /**
     * Send booking cancellation logic. Trigger BPMN process event for booking cancellation.
     * BPMN Event Triggers always need a proper correlation ID to properly identify process instance where the event
     * is to be triggered.
     *
     * @param bookingCancellation Contents of the booking cancellation event
     */
    public void sendCancellation(SampleBookingCancellation bookingCancellation) {
        log.info("Booking Cancellation event to be sent to camunda");
        sendEventMessage(BOOKING_CANCELLATION_BPMN_MESSAGE_ID, String.format("booking-%s", bookingCancellation.getBookingRef()),Map.of("booking-cancellation-event",bookingCancellation));
    }

    /**
     * Initialize Camunda BPMN Process for latest bpmn definition with provided list of variables.
     *
     * @param bookingRequest Object containing variable values for process initialization.
     */
    public ProcessInstanceEvent sendBookingRequest(SampleBookingRequest bookingRequest) {
        //REVIEW: Use Correlation ID for this message to connect security context.
        // Add Principal Name + role to base message object name for potential process flow logic.
        // Consider Cache for security context.
        return camundaClient
        .newCreateInstanceCommand()
        .bpmnProcessId(SampleBpmnConstants.BPMN_PROCESS_ID)
        .latestVersion()
        .variables(Map.of("carrier", bookingRequest.getCarrier(),
                          "customer", bookingRequest.getCustomer(),
                          "pol", bookingRequest.getPol(),
                          "pod", bookingRequest.getPod()))
        .send()
        .join();
    }

    /**
     * Trigger a camunda BPMN Process event with message, correlation and variables.
     *
     * @param messageName Name of the Event message from bpmn process definition node that awaits an event
     * @param correlationKey Correlation key used to identify process instances across service calls
     * @param variables Event context to be passed to the process for following steps
     * @return Response with Message ID and TenantID
     */
    private PublishMessageResponse sendEventMessage(String messageName, String correlationKey, Map<String, Object> variables) {
        return camundaClient
                .newPublishMessageCommand()
                .messageName(messageName)
                .correlationKey(correlationKey)
                .variables(variables)
                .send()
                .join();
    }

}
