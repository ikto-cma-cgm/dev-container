package ${{values.java_package_name| replace("/", ".")}}.booking.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor // Required for serialization from camunda
public class SampleBooking {
    private String shippingCompany;
    private String bookingRef;
    private String voyageReference;

    private String pol;
    private String pod;
}
