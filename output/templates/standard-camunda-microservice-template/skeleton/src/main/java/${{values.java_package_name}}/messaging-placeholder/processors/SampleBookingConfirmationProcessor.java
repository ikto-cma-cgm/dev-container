package ${{values.java_package_name| replace("/", ".")}}.messaging.processors;

import org.springframework.stereotype.Component;

import com.cma.core.technical.message.consumer.event.Event;
import com.cma.core.technical.message.consumer.event.EventProcessor;
import com.cma.core.technical.message.consumer.event.EventResponse;
import ${{values.java_package_name| replace("/", ".")}}.messaging.events.SampleBookingEvent;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingConfirmation;
import ${{values.java_package_name| replace("/", ".")}}.booking.services.SampleWorkflowCommandService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class SampleBookingConfirmationProcessor implements EventProcessor{
    

    private final SampleWorkflowCommandService workflowCommandService;

    @Override
    public String getManagedEventType() {
       return SampleBookingConfirmation.ORDER_TYPE;
    }

    @Override
    public EventResponse process(Event event) {
            SampleBookingConfirmation  bookingConfirmation=(SampleBookingConfirmation) ((SampleBookingEvent) event).getBookingOrder();
            this.workflowCommandService.sendConfirmation(bookingConfirmation);
            return new EventResponse(event, false);
    }

}
