## ${{values.artifact_id}}

${{values.description}}

### Tech Stack
- Java ${{values.java_version}}
- Spring Boot ${{values.spring_boot_version}}
- Camunda 8
- Maven

### Getting Started

1. Clone the repository
2. Build: `mvn clean install`
3. Run locally: `mvn spring-boot:run -Plocal`

### Configuration

Local configuration is managed in `src/main/resources/application-local.yaml.template`. Copy it to `application-local.yaml` and fill in your secrets.

### Camunda Integration

This service is a Camunda adapter that connects to the Camunda BPMN platform. Configure your Camunda cluster credentials in `application-local.yaml`.

### TechDocs

Documentation is built with MkDocs and available in the Docs tab of the Backstage service page.
