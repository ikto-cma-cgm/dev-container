package ${{values.java_package_name| replace("/", ".")}}.messaging;

import com.cma.core.technical.message.consumer.event.EventResponse;
import com.cma.core.technical.message.consumer.exception.ExceptionManager;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.sqs.model.Message;
/**
 * EventExceptionManager is an implementation of the ExceptionManager interface.
 * This class provides methods to manage exceptions that occur during event processing.
 * https://backstage-int.it-architecture-noprd.aws.cld.cma-cgm.com/catalog/default/component/technical-message-consumer/docs
 */
@Component
public class SampleEventExceptionManager implements ExceptionManager {

    /**
     * @param eventResponse the event processing response.
     * @param message the consumed message.
     * @return boolean value indicating whether the failed event should be retried or not.
     */
    @Override
    public boolean processException(EventResponse eventResponse, Message message) {
        return true;
    }

    /**
     * This method is used to clear any error states from previous executions.
     * 
     * @param message the consumed message.
     */
    @Override
    public void cleanPreviousError(Message message) {
        //Implementation logic here
    }
}
