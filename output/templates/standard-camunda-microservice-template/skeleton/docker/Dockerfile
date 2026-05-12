{% if values.java_version === '17' -%}
FROM 333230080375.dkr.ecr.eu-west-1.amazonaws.com/image_factory/openjdk:17-alpine3.18
{%- endif %}
{% if values.java_version === '21' -%}
FROM 333230080375.dkr.ecr.eu-west-1.amazonaws.com/image_factory/openjdk:openjdk-21-alpine3.21-amd64
{%- endif %}
MAINTAINER cma

RUN env

COPY certs/*.cer /tmp/
RUN echo $JAVA_HOME

RUN for file in /tmp/*.cer; \
    do certName=`basename $file .cer`; \
    echo -en "Importing certificate : $file : "; \
    keytool -import -alias $certName -file $file -keystore $JAVA_HOME/lib/security/cacerts -keypass changeit -storepass changeit -noprompt; \
    done;

COPY jar/*.jar /app.jar


ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

ENV spring.cloud.bootstrap.enabled=true


ENV SERVER_PORT 8080

EXPOSE ${SERVER_PORT}

RUN addgroup -g 1111 dataways && adduser -g 1111 -u 2222 -h /home/app -s /bin/sh --disabled-password app
USER app

ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djavax.net.ssl.keyStore=$JAVA_HOME/lib/security/cacerts -Djavax.net.ssl.keyStorePassword=changeit -Djava.security.egd=file:/dev/./urandom -jar --add-opens java.base/java.lang=ALL-UNNAMED /app.jar" ]