# SQS Integration

This module processes SQS messages for booking events using the technical-message-consumer library.

## Components

- **SampleMessagePayloadMapper**: Maps SQS messages to booking events
- **SampleEventExceptionManager**: Handles processing exceptions
- **SampleBookingEvent**: Event wrapper for booking orders
- **Processors**: Handle request, confirmation, and cancellation events

## Configuration

Add SQS queue credentials to `application-local.yaml`.
