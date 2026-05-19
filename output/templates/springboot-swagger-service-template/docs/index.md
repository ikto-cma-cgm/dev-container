## Spring Boot Microservice from OpenAPI Spec

Ce template permet de creer un microservice Spring Boot 3 dont le code API est genere automatiquement a partir d'une specification OpenAPI/Swagger fournie.

### Comment ca fonctionne

1. **Fetch skeleton** : le squelette Spring Boot (Maven, Docker, CI) est copie
2. **Fetch OpenAPI spec** : la specification Swagger est telechargee depuis une URL et placee dans `src/main/resources/api/openapi.yaml`
3. **Publish + Register** : le code est publie sur Git et enregistre dans le Catalog Backstage

Apres le scaffold, `mvn generate-sources` genere les interfaces de controleur, les modeles et les API a partir de la specification OpenAPI.

### Details techniques

- OpenAPI Generator Maven plugin (mode `interfaceOnly` + `delegatePattern`)
- Les interfaces generees sont dans `${{ values.packageName }}.api.controller`
- Les implementations a ecrire sont dans `${{ values.packageName }}.api.service.delegate`
- Les modeles DTO generes sont dans `${{ values.packageName }}.api.model`

### References

- [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator)
- [Spring Boot](https://spring.io/projects/spring-boot)
