package ${{values.java_package_name| replace("/", ".")}}.booking.workers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.cma.it.development.bpm.tests.jobworkers.JobWorkerAnnotationConfiguration;
import com.cma.it.development.bpm.tests.jobworkers.JobWorkerAnnotationTester;
import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBooking;
import ${{values.java_package_name| replace("/", ".")}}.booking.services.SampleBookingService;

import io.camunda.client.api.response.ActivatedJob;
import io.camunda.client.api.worker.JobClient;

@ExtendWith(MockitoExtension.class)
public class SampleBookingWorkersTest {

    @InjectMocks
    private SampleBookingWorkers bookingWorkers;

    @Mock
    private JobClient client;

    @Mock
    private ActivatedJob job;

    @Mock
    private SampleBookingService bookingService;

    // Example for Booking Worker Testing
    @Test
    public void testHandleFindBookings() {
        //Validation of the Job Worker annotation
        JobWorkerAnnotationConfiguration expectedConfiguration = new JobWorkerAnnotationConfiguration();
        expectedConfiguration.setType(SampleBookingWorkers.FIND_BOOKING_WORKER_TYPE);
        expectedConfiguration.setAutoComplete(Boolean.TRUE);
        JobWorkerAnnotationTester.validateWorkerAnnotation(SampleBookingWorkers.class, "handleFindBookings", expectedConfiguration);
        // Business Method validation
        final String carrier = "CMA CGM";
        final String pol = "POL";
        final String pod = "POD";
        SampleBooking bkg = new SampleBooking(carrier, "BOOKING-REF" + carrier, "VOYAGE-REF" + carrier, pol, pod);
        Mockito.when(bookingService.findBooking(carrier, pol, pod)).thenReturn(Optional.of(bkg));
        Map<String, Object> response = bookingWorkers.handleFindBookings(client, job, carrier, pol, pod);
        assertEquals(1, response.size());
        assertEquals(response.get("booking"), bkg);
        Mockito.verify(bookingService, times(1)).findBooking(carrier, pol, pod);
    }


}
