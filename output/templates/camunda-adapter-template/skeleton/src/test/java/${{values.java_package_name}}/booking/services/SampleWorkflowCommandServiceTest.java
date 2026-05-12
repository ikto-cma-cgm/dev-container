package ${{values.java_package_name| replace("/", ".")}}.booking.services;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;


import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingCancellation;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingConfirmation;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingRequest;
import ${{values.java_package_name| replace("/", ".")}}.common.constants.SampleBpmnConstants;

import io.camunda.client.CamundaClient;
import io.camunda.client.api.CamundaFuture;
import io.camunda.client.api.command.CreateProcessInstanceCommandStep1;
import io.camunda.client.api.command.CreateProcessInstanceCommandStep1.CreateProcessInstanceCommandStep2;
import io.camunda.client.api.command.CreateProcessInstanceCommandStep1.CreateProcessInstanceCommandStep3;
import io.camunda.client.api.command.PublishMessageCommandStep1;
import io.camunda.client.api.command.PublishMessageCommandStep1.PublishMessageCommandStep2;
import io.camunda.client.api.command.PublishMessageCommandStep1.PublishMessageCommandStep3;
import io.camunda.client.api.response.ProcessInstanceEvent;
import io.camunda.client.api.response.PublishMessageResponse;

@ExtendWith(MockitoExtension.class)
public class SampleWorkflowCommandServiceTest {


    @InjectMocks
    SampleWorkflowCommandService workflowCommandService;

    @Mock
    private CamundaClient camundaClient;

    @Mock
    private PublishMessageCommandStep1 zeebepublicshMessageCmd1;

    @Mock
    private PublishMessageCommandStep2 zeebepublicshMessageCmd2;

    @Mock
    private PublishMessageCommandStep3 zeebepublicshMessageCmd3;

    @Mock
    private CamundaFuture<PublishMessageResponse> publishMessageFuture;

    @Mock
    private PublishMessageResponse publishResponse;


    @Mock
    private CreateProcessInstanceCommandStep1 createProcessInstanceCommandStep1;


    @Mock
    private CreateProcessInstanceCommandStep2 createProcessInstanceCommandStep2;


    @Mock
    private CreateProcessInstanceCommandStep3 createProcessInstanceCommandStep3;

    @Mock
    private CamundaFuture<ProcessInstanceEvent> processInstanceFuture;

    @Mock
    private ProcessInstanceEvent processInstanceEvent;

    @Test
    public void testSendConfirmation() {
        SampleBookingConfirmation bookingConfirmation = getBookingConfirmation();

        when(camundaClient.newPublishMessageCommand()).thenReturn(zeebepublicshMessageCmd1);
        when(zeebepublicshMessageCmd1.messageName(Mockito.anyString())).thenReturn(zeebepublicshMessageCmd2);
        when(zeebepublicshMessageCmd2.correlationKey(Mockito.anyString())).thenReturn(zeebepublicshMessageCmd3);
        when(zeebepublicshMessageCmd3.variables(Mockito.any(Map.class))).thenReturn(zeebepublicshMessageCmd3);
        when(zeebepublicshMessageCmd3.send()).thenReturn(publishMessageFuture);
        when(publishMessageFuture.join()).thenReturn(publishResponse);

        workflowCommandService.sendConfirmation(bookingConfirmation);

        verify(camundaClient, times(1)).newPublishMessageCommand();
        verify(zeebepublicshMessageCmd1, times(1)).messageName(SampleWorkflowCommandService.BOOKING_CONFIRMATION_BPMN_MESSAGE_ID);
        verify(zeebepublicshMessageCmd2, times(1)).correlationKey(String.format("booking-%s", bookingConfirmation.getBookingRef()));
        verify(zeebepublicshMessageCmd3, times(1)).variables(Map.of("booking-confirmation-event", bookingConfirmation));
        verify(zeebepublicshMessageCmd3, times(1)).send();
        verify(publishMessageFuture, times(1)).join();
    }

    @Test
    public void testSendCancellation() {
        SampleBookingCancellation bookingCancellation = getBookingCancellation();

        when(camundaClient.newPublishMessageCommand()).thenReturn(zeebepublicshMessageCmd1);
        when(zeebepublicshMessageCmd1.messageName(Mockito.anyString())).thenReturn(zeebepublicshMessageCmd2);
        when(zeebepublicshMessageCmd2.correlationKey(Mockito.anyString())).thenReturn(zeebepublicshMessageCmd3);
        when(zeebepublicshMessageCmd3.variables(Mockito.any(Map.class))).thenReturn(zeebepublicshMessageCmd3);
        when(zeebepublicshMessageCmd3.send()).thenReturn(publishMessageFuture);
        when(publishMessageFuture.join()).thenReturn(publishResponse);

        workflowCommandService.sendCancellation(bookingCancellation);

        verify(camundaClient,times(1)).newPublishMessageCommand();
        verify(zeebepublicshMessageCmd1,times(1)).messageName(SampleWorkflowCommandService.BOOKING_CANCELLATION_BPMN_MESSAGE_ID);
        verify(zeebepublicshMessageCmd2,times(1)).correlationKey(String.format("booking-%s", bookingCancellation.getBookingRef()));
        verify(zeebepublicshMessageCmd3,times(1)).variables(Map.of("booking-cancellation-event",bookingCancellation));
        verify(zeebepublicshMessageCmd3,times(1)).send();
        verify(publishMessageFuture,times(1)).join();
    }
    

    @Test
    public void testSendBookingRequest(){
        SampleBookingRequest bookingRequest=getBookingRequest();
        when(camundaClient.newCreateInstanceCommand()).thenReturn(createProcessInstanceCommandStep1);
        when(createProcessInstanceCommandStep1.bpmnProcessId(SampleBpmnConstants.BPMN_PROCESS_ID)).thenReturn(createProcessInstanceCommandStep2);
        when(createProcessInstanceCommandStep2.latestVersion()).thenReturn(createProcessInstanceCommandStep3);
        when(createProcessInstanceCommandStep3.variables(Mockito.any(Map.class))).thenReturn(createProcessInstanceCommandStep3);
        when(createProcessInstanceCommandStep3.send()).thenReturn(processInstanceFuture);
        when(processInstanceFuture.join()).thenReturn(processInstanceEvent);

        workflowCommandService.sendBookingRequest(bookingRequest);
        verify(camundaClient,times(1)).newCreateInstanceCommand();
        verify(createProcessInstanceCommandStep1,times(1)).bpmnProcessId(SampleBpmnConstants.BPMN_PROCESS_ID);
        verify(createProcessInstanceCommandStep2,times(1)).latestVersion();
        verify(createProcessInstanceCommandStep3,times(1)).variables(Map.of("carrier", bookingRequest.getCarrier(),
                          "customer", bookingRequest.getCustomer(),
                          "pol", bookingRequest.getPol(),
                          "pod", bookingRequest.getPod()));
        verify(createProcessInstanceCommandStep3,times(1)).send();
        verify(processInstanceFuture,times(1)).join();



    }

    private SampleBookingRequest getBookingRequest(){
        return new SampleBookingRequest("carrier", "XXSS", "NTLRM", "CHSCG");
    }

    private SampleBookingConfirmation getBookingConfirmation(){
        return new SampleBookingConfirmation("ref-XXX", "carrier");
    }
    private SampleBookingCancellation getBookingCancellation(){
        return new SampleBookingCancellation("ref-XXX", "carrier");
    }
}
