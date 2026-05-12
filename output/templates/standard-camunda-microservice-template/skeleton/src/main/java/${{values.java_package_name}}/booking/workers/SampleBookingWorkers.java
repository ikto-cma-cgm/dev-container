package ${{values.java_package_name| replace("/", ".")}}.booking.workers;

import java.util.Map;

import org.springframework.stereotype.Component;


import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBooking;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingCancellation;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingConfirmation;
import ${{values.java_package_name| replace("/", ".")}}.booking.services.SampleBookingService;

import io.camunda.client.api.response.ActivatedJob;
import io.camunda.client.api.worker.JobClient;
import io.camunda.client.exception.CamundaError;
import io.camunda.client.annotation.JobWorker;
import io.camunda.client.annotation.Variable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * A job worker is a service capable of performing particular Task associated as
 * part of the BPMN process
 * They could be seen as controller in REST endpoint meaning that they are the
 * entrypoint for Camunda within CMA-CGM system
 * See the documentation there
 * https://docs.camunda.io/docs/apis-tools/spring-zeebe-sdk/configuration/ for
 * different available configuration
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class SampleBookingWorkers {

    // Should be put in application properties so  that variable replcament and shareing
    // Manage that may go through a new annotation processor with someyhing like the process and the annotations processor reading the data from the spring context
    public static final String FIND_BOOKING_WORKER_TYPE = "camunda-adapter-template.booking-process.worker.booking.find"; 
    public static final String BOOKING_CONFIRMATION_WORKER_TYPE = "camunda-adapter-template.booking-process.worker.confirmation"; 
    public static final String BOOKING_CANCELLATION_WORKER_TYPE = "camunda-adapter-template.booking-process.worker.cancellation";

    // REVIEW: Transactions @Transactional, make sure job workers are executed within a transactional context.
    // REVIEW: Exception handling and compensations in case of distributed process failure?
    // Add BpmnException example to show how to route errors in the process

    private final SampleBookingService bookingService;

    /**
      * This example provide a way to execute business logic and to append a result
      * that could be used further in the process
      * Here a booking if we do not find it we can throw an error
      * When using autoComplete you can
      * Return a Map, String, InputStream, or Object, which will then be added to the process variables.
      * @param client
      * @param job
      * @param carrier
      * @param pol
      * @param pod
      * @return
      */
    @JobWorker(type = FIND_BOOKING_WORKER_TYPE,autoComplete = true)
    public Map<String, Object> handleFindBookings(final JobClient client, final ActivatedJob job,
            @Variable("carrier") String carrier,@Variable("pol") String pol,@Variable("pod") String pod) {
        log.info("Find Available booking  for carrier {} start", carrier);
        final var opBooking = bookingService.findBooking(carrier,pol,pod);
        // REVIEW: Optional<Booking> booking instead of null.
        if (opBooking.isPresent()) {
            log.info("Find Available booking carrier {} succeed", carrier);
            return Map.of("booking", opBooking.get());
        } else {
            throw  CamundaError.bpmnError("NO_BOOKING_FOUND", "No booking found for the carrier " + carrier,
                    Map.of("carrier", carrier));
        }
    }

    /**
     * This example provide a way to execute business logic and to append a result
     * It is a demonstration of the fetchVariables example.
     * It is a good practice to only fetch variable on which we are willing to work (for performance reasons)
     * It is also possible to fetch an object from the BPMN context
     * @param client
     * @param job
     * @param booking
     * @param bookingConfirmation the booking confirmation is here sent alongside the message see #WorkflowCommandService
     */

    @JobWorker(type = BOOKING_CONFIRMATION_WORKER_TYPE , fetchVariables={"booking","booking-confirmation-event"},autoComplete = false)
    public void handleBookingConfirmation(final JobClient client,final ActivatedJob job,@Variable("booking") SampleBooking booking, @Variable("booking-confirmation-event") SampleBookingConfirmation bookingConfirmation){
        log.info("Receive a booking confirmation event for bookingref -> {}  carrier ->{}", booking.getBookingRef(), bookingConfirmation.getCarrier());
        bookingService.confirmBooking(booking);
        client.newCompleteCommand(job.getKey()).send();
        log.info("Booking confirmation bookingref -> {}  carrier ->{} processing is over", booking.getBookingRef() , bookingConfirmation.getCarrier());
    }
    /**
     * This example provide a way to execute business logic and to append a result
     * It is a demonstration of the fetchVariables example.
     * It is a good practice to only fetch variable on which we are willing to work (for performance reasons)
     * It is also possible to fetch an object from the BPMN context
     * @param booking
     * @param bookingCancellationEvent
     */
    @JobWorker(type = BOOKING_CANCELLATION_WORKER_TYPE , fetchVariables={"booking","booking-cancellation-event"})
    public void handleBookingCancellation(@Variable("booking") SampleBooking booking, @Variable("booking-cancellation-event") SampleBookingCancellation bookingCancellationEvent){
        log.info("Receive a booking cancellation for bookingref -> {}  carrier ->{}", booking.getBookingRef(),bookingCancellationEvent.getCarrier());
        bookingService.cancelBooking(booking);
        log.info("Booking cancellation bookingref -> {}  carrier ->{} processing is over", booking.getBookingRef(),bookingCancellationEvent.getCarrier());
    }


}
