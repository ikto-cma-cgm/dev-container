package ${{values.java_package_name| replace("/", ".")}}.common.metrics;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.micrometer.cloudwatch2.CloudWatchConfig;
import io.micrometer.cloudwatch2.CloudWatchMeterRegistry;
import io.micrometer.core.instrument.Clock;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Metrics;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import software.amazon.awssdk.services.cloudwatch.CloudWatchAsyncClient;

@Configuration
public class SampleRegistryFactory {

    @Bean
    @ConditionalOnProperty(prefix = "management.metrics.registry", name="active", havingValue = "cloudwatch")
    public MeterRegistry getCloudwatchRegistry(@Value("${management.metrics.registry.cloudwatch.namespace}") String namespace,
                                          @Value("${management.metrics.registry.cloudwatch.batch-size}") String batchSize, 
                                          @Value("${management.metrics.registry.cloudwatch.step-in-seconds}") Integer stepDuration) {
                                          
        final String step= Duration.ofSeconds(stepDuration).toString();

        CloudWatchConfig config = new CloudWatchConfig() {
            @Override
            public String get(String key) {
                switch (key) {
                    case "cloudwatch.namespace":
                    return namespace;
                    case "cloudwatch.batchSize":
                    return batchSize;
                    case "cloudwatch.step":
                    return step;
                
                    default:
                        return null;
                }

            }
            
        };
        
        CloudWatchMeterRegistry registry = new CloudWatchMeterRegistry(config, Clock.SYSTEM,
                CloudWatchAsyncClient.create());
        Metrics.addRegistry(registry);
        return registry;
    }

    @Bean
    @ConditionalOnProperty(prefix = "management.metrics.registry", name="active",  matchIfMissing=true)
    public MeterRegistry getLocalregistry(){
        return new SimpleMeterRegistry();
    }

}
