package ${{values.java_package_name| replace("/", ".")}}.booking.controller;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingCancellation;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingConfirmation;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBookingRequest;
import ${{values.java_package_name| replace("/", ".")}}.booking.services.SampleWorkflowCommandService;

@ExtendWith(MockitoExtension.class)
public class SampleBookingControllerTest {
    
    @InjectMocks
    SampleBookingController bookingController;


    @Mock
    private  SampleWorkflowCommandService workflowCommandService;

    @Test
    public void testNewBookingRequest(){
        SampleBookingRequest br=getBookingRequest();
        bookingController.newBookingRequest(br);
        verify(workflowCommandService,times(1)).sendBookingRequest(br);
    }


    @Test
    public void testCancelRequest(){
        SampleBookingCancellation br=getBookingCancellation();
        bookingController.cancelRequest(br);
        verify(workflowCommandService,times(1)).sendCancellation(br);
    }


    @Test
    public void testConfirmRequest(){
        SampleBookingConfirmation br=getBookingConfirmation();
        bookingController.confirmRequest(br);
        verify(workflowCommandService,times(1)).sendConfirmation(br);
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
