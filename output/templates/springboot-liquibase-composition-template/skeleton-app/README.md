# ${{ values.name }}

${{ values.description }}

## Technologies

- Java ${{ values.javaVersion }}
- Spring Boot ${{ values.springBootVersion }}
- ${{ values.dbms | capitalize }}
- Liquibase
- Maven

## Lancement local

```bash
mvn clean install
mvn spring-boot:run -Plocal
```

## Migrations

Les scripts Liquibase sont dans `src/main/resources/db/migration/`.

## Monitoring

Actuator exposé sur `http://localhost:8080/actuator`.
