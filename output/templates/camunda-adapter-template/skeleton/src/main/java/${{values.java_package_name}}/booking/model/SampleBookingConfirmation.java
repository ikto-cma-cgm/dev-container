package ${{values.java_package_name| replace("/", ".")}}.booking.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
public class SampleBookingConfirmation implements SampleBookingOrder{

    public static final String ORDER_TYPE="BOOKING_CONFIRMATION";
    
    @Getter
    @Setter
    @JsonProperty("bookingRef")
    private  String bookingRef;


    @Getter
    @Setter
    @JsonProperty("carrier")
    private  String  carrier;
    
    @Override
    public String getType() {
      return ORDER_TYPE;
    }
}
