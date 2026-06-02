# JMeter Load Testing Service - Cross-Platform Docker Image
# Maintained by: Quality Platform Team
# Compatible: Mac (Intel/ARM), Linux, Windows
# Usage: Mount your test plans to /jmeter and run

FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="quality-platform-team@your-company.com"
LABEL description="JMeter Load Testing Service - Cross-platform testing environment"
LABEL version="1.0.0"

# JMeter version
ARG JMETER_VERSION=5.6.3

# Install dependencies
RUN apk add --no-cache \
    bash \
    curl \
    ca-certificates \
    tzdata \
    fontconfig \
    ttf-dejavu \
    && rm -rf /var/cache/apk/*

# Create non-root user for better security and Windows volume compatibility
# UID/GID 1000 is standard and works well across platforms
RUN addgroup -g 1000 jmeter && \
    adduser -D -u 1000 -G jmeter jmeter

# Install JMeter
WORKDIR /opt
RUN curl -L https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-${JMETER_VERSION}.tgz -o apache-jmeter.tgz && \
    tar -xzf apache-jmeter.tgz && \
    rm apache-jmeter.tgz && \
    ln -s apache-jmeter-${JMETER_VERSION} jmeter

# Install JMeter Plugins Manager
RUN cd /opt/jmeter/lib/ext && \
    curl -L https://repo1.maven.org/maven2/kg/apc/jmeter-plugins-manager/1.10/jmeter-plugins-manager-1.10.jar -o jmeter-plugins-manager-1.10.jar && \
    curl -L https://repo1.maven.org/maven2/kg/apc/cmdrunner/2.3/cmdrunner-2.3.jar -o cmdrunner-2.3.jar

# Install PluginsManagerCMD
RUN cd /opt/jmeter/lib && \
    java -cp /opt/jmeter/lib/ext/jmeter-plugins-manager-1.10.jar org.jmeterplugins.repository.PluginManagerCMDInstaller

# Copy plugin list and install essential plugins
COPY plugins/plugin-list.txt /tmp/plugin-list.txt
RUN /opt/jmeter/bin/PluginsManagerCMD.sh install-for-jmx /tmp/plugin-list.txt || true

# Set working directory
WORKDIR /jmeter

# Copy base configuration
COPY --chown=jmeter:jmeter config/jmeter.properties /opt/jmeter/bin/jmeter.properties
COPY --chown=jmeter:jmeter config/user.properties /opt/jmeter/bin/user.properties
COPY --chown=jmeter:jmeter config/reportgenerator.properties /opt/jmeter/bin/reportgenerator.properties

# Create directories for test artifacts with proper permissions
RUN mkdir -p \
    /jmeter/test-plans \
    /jmeter/test-data \
    /jmeter/results \
    /jmeter/reports \
    /jmeter/logs && \
    chown -R jmeter:jmeter /jmeter

# Copy entrypoint
COPY --chmod=755 entrypoint.sh /usr/local/bin/entrypoint.sh

# Environment variables (can be overridden at runtime)
ENV JMETER_HOME=/opt/jmeter \
    PATH=/opt/jmeter/bin:$PATH \
    JMETER_LANGUAGE=en \
    HEAP="-Xms1g -Xmx1g -XX:MaxMetaspaceSize=256m" \
    TZ=Europe/Paris \
    # Test execution defaults
    TARGET_HOST=localhost \
    TARGET_PORT=8080 \
    TARGET_PROTOCOL=http \
    THREADS=10 \
    RAMP_UP=10 \
    DURATION=60 \
    # Reporting
    GENERATE_REPORT=true

# Switch to non-root user
USER jmeter

# Volumes for mounting test plans and results
VOLUME ["/jmeter/test-plans", "/jmeter/test-data", "/jmeter/results", "/jmeter/reports"]

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD jmeter --version || exit 1

# Use entrypoint for flexibility
ENTRYPOINT ["entrypoint.sh"]

# Default command runs tests
CMD ["run-tests"]
