package ${{values.java_package_name| replace("/", ".")}}.common.metrics;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;

@Configuration
public class SampleMetricsConfiguration {

    @Bean(name=SampleMetricsProperties.CASE_BOOKING_REQUEST_COUNTER_NAME)
    public Counter getCaseBookingRequest(MeterRegistry registry) {
        return registry.counter(SampleMetricsProperties.CASE_BOOKING_REQUEST_COUNTER_NAME);
    }

}
