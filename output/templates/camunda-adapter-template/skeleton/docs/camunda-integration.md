# Camunda Integration

This adapter connects to the Camunda 8 platform using the Camunda Spring Boot SDK.

## Key Components

- **SampleWorkflowCommandService**: Sends commands (start process, publish messages) to Camunda
- **SampleBookingWorkers**: Job workers that execute tasks in the BPMN process
- **SampleBookingController**: HTTP endpoints to trigger BPMN events

## Configuration

Set your Camunda cluster credentials in `application-local.yaml`:

```yaml
camunda:
  client:
    mode: saas
    auth:
      client-id: your-client-id
      client-secret: your-client-secret
    cluster-id: your-cluster-id
    region: your-region
```

## Process Flow

1. Start a booking process via POST `/booking/workflow/start`
2. Camunda triggers job workers for business logic
3. Send confirmation/cancellation events via HTTP or SQS
