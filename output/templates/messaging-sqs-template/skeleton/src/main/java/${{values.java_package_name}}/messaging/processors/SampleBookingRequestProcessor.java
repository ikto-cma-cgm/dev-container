package ${{values.java_package_name| replace("/", ".")}}.messaging.processors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.cma.core.technical.message.consumer.event.Event;
import com.cma.core.technical.message.consumer.event.EventProcessor;
import com.cma.core.technical.message.consumer.event.EventResponse;
import ${{values.java_package_name| replace("/", ".")}}.messaging.events.SampleBookingEvent;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingRequest;
import ${{values.java_package_name| replace("/", ".")}}.booking.services.SampleWorkflowCommandService;
import ${{values.java_package_name| replace("/", ".")}}.common.metrics.SampleMetricsProperties;

import io.micrometer.core.instrument.Counter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


/**
 * SampleEventProcessor is an implementation of the EvenProcessor interface.
 * This class provides methods to process events and manage event processing logic.
 * https://backstage-int.it-architecture-noprd.aws.cld.cma-cgm.com/catalog/default/component/technical-message-consumer/docs
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class SampleBookingRequestProcessor implements EventProcessor{


    private final SampleWorkflowCommandService workflowCommandService;

    @Qualifier(SampleMetricsProperties.CASE_BOOKING_REQUEST_COUNTER_NAME)
    private final Counter counter;

     

    @Override
    public String getManagedEventType() {
        return SampleBookingRequest.ORDER_TYPE;
    }
    

    /**
     * Whenever we receive a booking Request event we send a new process
     */
    @Override
    public EventResponse process(Event event) {
        SampleBookingRequest  bookingRequest=(SampleBookingRequest) ((SampleBookingEvent) event).getBookingOrder();
        this.workflowCommandService.sendBookingRequest(bookingRequest);
       return new EventResponse(event, false);
    }

}
