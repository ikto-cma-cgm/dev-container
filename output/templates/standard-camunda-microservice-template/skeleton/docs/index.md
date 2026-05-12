# Introduction
You have just generated a Camunda adapater based template.
It aims to act as a connector between the Camunda Platform and the business project. 
It has been implemented to be aligned with the following BPMN integration patterns defined for the BPMN integration.
1. SQS integration for incoming events (using CMA Technical Message Consumer)
2. Integration with Camunda using the GRPC client
3. Camunda Job Worker implementation following [Camunda recommandations](https://docs.camunda.io/docs/components/concepts/job-workers/).

Next -&gt; [Template content](./files/template-content.md)