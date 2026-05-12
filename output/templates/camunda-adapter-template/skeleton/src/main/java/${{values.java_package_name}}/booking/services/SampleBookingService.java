package ${{values.java_package_name| replace("/", ".")}}.booking.services;

import org.springframework.stereotype.Service;

import ${{values.java_package_name| replace("/", ".")}}.booking.model.SampleBooking;

import lombok.extern.slf4j.Slf4j;

import java.util.Optional;

@Service
@Slf4j
public class SampleBookingService {


    public Optional<SampleBooking> findBooking(String carrier, String pol, String pod){
        var booking = new SampleBooking(carrier, "BOOKING-REF"+carrier, "VOYAGE-REF"+carrier, pol, pod);
        return Optional.of(booking);
    }

    public void confirmBooking(SampleBooking booking){
        log.info("Confirmation of booking bookingRef {} starts", booking.getBookingRef());
        log.info("Confirmation of booking bookingRef {} is over", booking.getBookingRef());
    }

    public void cancelBooking(SampleBooking booking){
        log.info("Cancellation of booking bookingRef {} starts", booking.getBookingRef());
        log.info("Cancellation of booking bookingRef {} is over", booking.getBookingRef());
    }
}
