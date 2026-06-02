# WebdriverIO Testing Service - Cross-Platform Docker Image
# Maintained by: Quality Platform Team
# Compatible: Mac (Intel/ARM), Linux, Windows
# Usage: Mount your test code to /tests and run

# Use official Node.js image with multi-arch support
FROM node:18-slim

LABEL maintainer="quality-platform-team"
LABEL description="WebdriverIO E2E Testing Service - Cross-platform testing environment"
LABEL version="1.0.0"

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install Chromium and dependencies (works on AMD64 and ARM64)
RUN apt-get update && apt-get install -y \
    # Chromium (available for multiple architectures)
    chromium \
    chromium-driver \
    # Essential libraries
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \
    libgtk-3-0 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    # Utilities
    curl \
    ca-certificates \
    tzdata \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for better security and Windows volume compatibility
# UID/GID 1000 is standard and works well across platforms
RUN groupadd -r wdio -g 1000 && \
    useradd -r -g wdio -u 1000 -m -s /bin/bash wdio && \
    mkdir -p /home/wdio

# Set working directory
WORKDIR /tests

# Copy package.json with pre-defined dependencies
COPY package.json package-lock.json* ./

# Install WebdriverIO and common dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Create directories for test artifacts with proper permissions
RUN mkdir -p \
    /tests/tests \
    /tests/test-results/screenshots \
    /tests/test-results/videos \
    /tests/allure-results \
    /tests/allure-report \
    /tests/wdio-config && \
    # Set ownership to wdio user (important for volume mounts)
    chown -R wdio:wdio /tests

# Copy base configuration and entrypoint
COPY --chown=wdio:wdio config/wdio.base.conf.js /tests/config/wdio.base.conf.js
COPY --chmod=755 entrypoint.sh /usr/local/bin/entrypoint.sh

# Environment variables (can be overridden at runtime)
ENV CHROME_BIN=/usr/bin/chromium \
    NODE_ENV=test \
    BASE_URL=http://localhost:3000 \
    # Chrome flags for headless execution (cross-platform)
    CHROME_FLAGS="--no-sandbox --disable-dev-shm-usage --disable-gpu" \
    # Timezone (can be overridden)
    TZ=Europe/Paris \
    # NPM configuration
    NPM_CONFIG_LOGLEVEL=warn

# Switch to non-root user
USER wdio

# Volumes for mounting test code and results
# These work consistently across Mac/Linux/Windows with Docker Desktop
VOLUME ["/tests/tests", "/tests/wdio-config", "/tests/test-results", "/tests/allure-results"]

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node --version && chromium --version || exit 1

# Use entrypoint for flexibility
ENTRYPOINT ["entrypoint.sh"]

# Default command
CMD ["npm", "run", "test:e2e"]
