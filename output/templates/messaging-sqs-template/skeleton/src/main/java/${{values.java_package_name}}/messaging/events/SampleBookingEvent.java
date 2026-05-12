package ${{values.java_package_name| replace("/", ".")}}.messaging.events;

import com.cma.core.technical.message.consumer.event.Event;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingOrder;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@RequiredArgsConstructor
@Getter
@Setter
public class SampleBookingEvent implements Event {


    @Getter
    @ToString.Exclude
    @NonNull
    private final SampleBookingOrder bookingOrder;

    @Override
    public String getEventType() {
       return bookingOrder.getType();
    }
}
