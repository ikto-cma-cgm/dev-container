/**
 * JMeter Load Tests - Jenkins Pipeline Library
 *
 * This shared library provides reusable functions for running JMeter load tests
 * in Jenkins pipelines. It expects the jmeter/ directory to exist in the repository.
 *
 * Usage in Jenkinsfile:
 *
 * @Library('jmeter-pipeline') _
 *
 * pipeline {
 *     agent any
 *     stages {
 *         stage('Load Tests') {
 *             steps {
 *                 jmeterTests(
 *                     targetHost: 'api.example.com',
 *                     targetPort: '8080',
 *                     threads: 50,
 *                     duration: 120
 *                 )
 *             }
 *         }
 *     }
 * }
 *
 * Or as a standalone call:
 *
 * jmeterTests(targetHost: 'localhost')
 */

def call(Map config = [:]) {
    // Default configuration
    def defaults = [
        workingDirectory: 'jmeter',
        targetHost: 'localhost',
        targetPort: '8080',
        targetProtocol: 'http',
        testPlan: 'test-plans/load-test.jmx',
        threads: 10,
        duration: 60,
        rampUp: 10,
        uploadArtifacts: true,
        failOnError: false,
        performanceThreshold: 5.0  // Max acceptable error rate percentage
    ]

    // Merge defaults with provided config
    config = defaults + config

    echo "Running JMeter Load Tests"
    echo "  Working Directory: ${config.workingDirectory}"
    echo "  Target: ${config.targetProtocol}://${config.targetHost}:${config.targetPort}"
    echo "  Test Plan: ${config.testPlan}"
    echo "  Threads: ${config.threads}"
    echo "  Duration: ${config.duration}s"
    echo "  Ramp-up: ${config.rampUp}s"

    // Verify JMeter setup exists
    if (!fileExists(config.workingDirectory)) {
        error "JMeter directory not found at ${config.workingDirectory}. Please ensure the JMeter template has been applied to this repository."
    }

    def testResult = 'SUCCESS'
    def metrics = [:]

    try {
        dir(config.workingDirectory) {
            runLoadTests(config)
            metrics = analyzeResults(config)
        }
    } catch (Exception e) {
        testResult = 'FAILURE'
        if (config.failOnError) {
            throw e
        } else {
            echo "Load tests encountered issues but failOnError is false, continuing..."
            unstable(message: "Load tests failed: ${e.message}")
        }
    } finally {
        // Collect artifacts
        if (config.uploadArtifacts) {
            collectArtifacts(config)
        }

        // Cleanup
        dir(config.workingDirectory) {
            sh 'docker-compose down -v || true'
        }

        // Performance gate check
        if (metrics.errorRate && metrics.errorRate > config.performanceThreshold) {
            echo "WARNING: Error rate ${metrics.errorRate}% exceeds threshold ${config.performanceThreshold}%"
            if (config.failOnError) {
                error "Performance threshold exceeded"
            } else {
                unstable(message: "Error rate ${metrics.errorRate}% exceeds threshold ${config.performanceThreshold}%")
            }
        }
    }

    return [
        result: testResult,
        metrics: metrics
    ]
}

def runLoadTests(Map config) {
    echo "Running JMeter load tests in Docker..."

    withEnv([
        "TARGET_HOST=${config.targetHost}",
        "TARGET_PORT=${config.targetPort}",
        "TARGET_PROTOCOL=${config.targetProtocol}",
        "THREADS=${config.threads}",
        "DURATION=${config.duration}",
        "RAMP_UP=${config.rampUp}",
        "TEST_PLAN=${config.testPlan}"
    ]) {
        sh '''
            docker-compose up --build --abort-on-container-exit --exit-code-from jmeter || true
        '''
    }
}

def analyzeResults(Map config) {
    echo "Analyzing test results..."

    def metrics = [
        totalRequests: 0,
        errorCount: 0,
        errorRate: 0.0,
        avgResponseTime: 0
    ]

    if (fileExists('results/results.jtl')) {
        def jtlContent = readFile('results/results.jtl')
        def lines = jtlContent.split('\n')

        metrics.totalRequests = lines.size() - 1  // Exclude header
        metrics.errorCount = lines.findAll { it.contains(',false,') }.size()

        if (metrics.totalRequests > 0) {
            metrics.errorRate = (metrics.errorCount / metrics.totalRequests) * 100
            metrics.errorRate = Math.round(metrics.errorRate * 100) / 100  // Round to 2 decimals
        }

        echo "Total Requests: ${metrics.totalRequests}"
        echo "Error Count: ${metrics.errorCount}"
        echo "Error Rate: ${metrics.errorRate}%"
    } else {
        echo "No results file found at results/results.jtl"
    }

    return metrics
}

def collectArtifacts(Map config) {
    echo "Collecting test artifacts..."

    // Archive HTML reports
    archiveArtifacts(
        artifacts: "${config.workingDirectory}/reports/**/*",
        allowEmptyArchive: true,
        fingerprint: true
    )

    // Archive JTL results
    archiveArtifacts(
        artifacts: "${config.workingDirectory}/results/**/*",
        allowEmptyArchive: true,
        fingerprint: true
    )

    // Publish Performance report if plugin is available
    try {
        perfReport(
            sourceDataFiles: "${config.workingDirectory}/results/*.jtl",
            errorFailedThreshold: config.performanceThreshold,
            errorUnstableThreshold: config.performanceThreshold / 2
        )
    } catch (Exception e) {
        echo "Performance plugin not available, skipping report generation"
    }
}

// Variant for smoke testing
def smokeTest(Map config = [:]) {
    config.threads = config.threads ?: 1
    config.duration = config.duration ?: 10
    config.rampUp = config.rampUp ?: 1
    return call(config)
}

// Variant for stress testing
def stressTest(Map config = [:]) {
    config.threads = config.threads ?: 100
    config.duration = config.duration ?: 300
    config.rampUp = config.rampUp ?: 30
    return call(config)
}

// Variant for endurance testing
def enduranceTest(Map config = [:]) {
    config.threads = config.threads ?: 20
    config.duration = config.duration ?: 1800
    config.rampUp = config.rampUp ?: 60
    return call(config)
}

return this
