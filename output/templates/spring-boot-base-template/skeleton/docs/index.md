# ${{values.artifact_id}}

This service was scaffolded from the **Spring Boot Base Template**.

## Architecture

This is a Spring Boot microservice with the following features:

- **Security**: OAuth2 resource server configuration
- **Metrics**: CloudWatch metrics integration with Micrometer
- **Observability**: OpenTracing with Jaeger
- **Logging**: Logback with JSON formatting for production, human-readable for local

## Project Structure

```
src/main/java/${{ values.java_package_name }}/
├── Application.java
└── common/
    ├── security/
    ├── error/
    └── metrics/
```

## Local Development

1. Copy `application-local.yml.template` to `application-local.yml`
2. Update credentials and secrets
3. Run: `mvn spring-boot:run -Plocal`