package ${{values.java_package_name| replace("/", ".")}}.messaging.processors;

import org.springframework.stereotype.Component;

import com.cma.core.technical.message.consumer.event.Event;
import com.cma.core.technical.message.consumer.event.EventProcessor;
import com.cma.core.technical.message.consumer.event.EventResponse;
import ${{values.java_package_name| replace("/", ".")}}.messaging.events.SampleBookingEvent;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingCancellation;
import ${{values.java_package_name| replace("/", ".")}}.booking.services.SampleWorkflowCommandService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class SampleBookingCancellationProcessor implements EventProcessor{
    
    private final SampleWorkflowCommandService workflowCommandService;
    
    @Override
    public String getManagedEventType() {
       return SampleBookingCancellation.ORDER_TYPE;
    }

    @Override
    public EventResponse process(Event event) {
        SampleBookingCancellation  bookingCancellation=(SampleBookingCancellation) ((SampleBookingEvent) event).getBookingOrder();
        this.workflowCommandService.sendCancellation(bookingCancellation);
        return new EventResponse(event, false);
    }

}
