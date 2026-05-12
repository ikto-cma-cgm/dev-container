package ${{values.java_package_name| replace("/", ".")}}.booking.model;

public interface SampleBookingOrder {
    /**
     * Every Booking Order has a type
     * @return
     */
    String getType();
}
