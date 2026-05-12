package ${{values.java_package_name| replace("/", ".")}}.booking.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@AllArgsConstructor
public class SampleBookingRequest implements SampleBookingOrder{

    public  static final String ORDER_TYPE="BOOKING_REQUEST";

    @Getter
    @Setter
    @JsonProperty(value="carrier" , required=true)
    private String carrier;

    @Getter
    @Setter
    @JsonProperty(value="customerRef" , required=true)
    private String customer;


    @Getter
    @Setter
    @JsonProperty(value="pol" , required=true)
    private String pol;

    @Getter
    @Setter
    @JsonProperty(value="pod" , required=true)
    private String pod;

    @Override
    public String getType() {
      return ORDER_TYPE;
    }

    
    
    
}
