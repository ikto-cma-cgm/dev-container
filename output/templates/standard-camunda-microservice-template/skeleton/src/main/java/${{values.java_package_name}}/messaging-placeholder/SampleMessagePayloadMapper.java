package ${{values.java_package_name| replace("/", ".")}}.messaging;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.cma.core.technical.message.consumer.event.Event;
import com.cma.core.technical.message.consumer.event.EventMapper;
import ${{values.java_package_name| replace("/", ".")}}.messaging.events.SampleBookingEvent;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingCancellation;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingConfirmation;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingOrder;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.services.sqs.model.Message;
import software.amazon.awssdk.services.sqs.model.MessageAttributeValue;

/**
 * The event consumption relies on the technical-message-consumer library
 * https://backstage-int.it-architecture-noprd.aws.cld.cma-cgm.com/catalog/default/component/technical-message-consumer/docs
 * The 1st component is the mapper that will be used to extract the payload from the message
 */
@Component
@Slf4j
public class SampleMessagePayloadMapper  implements EventMapper {

   @Autowired
   private ObjectMapper objectMapper;

    @Override
    public Event createEventFromMessage(Message message) throws JsonProcessingException {
        return new SampleBookingEvent(this.getBookingOrder(message));
      
    }

    private SampleBookingOrder getBookingOrder(Message message){
        try {
            log.debug("Receive msg body {}", message);
            final MessageAttributeValue eventAttr= message.messageAttributes().get("type");
            if(eventAttr ==null){
              throw new IllegalArgumentException("type is not  found in the message attributes");
            }
            final String eventType=eventAttr.stringValue();
            switch (eventType) {
              case SampleBookingRequest.ORDER_TYPE:
                return objectMapper.readValue(message.body(), SampleBookingRequest.class);
              case SampleBookingConfirmation.ORDER_TYPE:
                return objectMapper.readValue(message.body(), SampleBookingConfirmation.class);
              case SampleBookingCancellation.ORDER_TYPE:
                return objectMapper.readValue(message.body(), SampleBookingCancellation.class);
              default:
                throw new IllegalArgumentException(eventType + " is not supported as eventtype");
            }
            
          } catch (JsonProcessingException e) {
            throw new IllegalArgumentException(e);
          }
    }
}
