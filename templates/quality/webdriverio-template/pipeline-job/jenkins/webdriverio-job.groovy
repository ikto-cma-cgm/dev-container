/**
 * WebDriverIO E2E Tests - Jenkins Pipeline Library
 *
 * This shared library provides reusable functions for running WebDriverIO E2E tests
 * in Jenkins pipelines. It expects the webdriver-io/ directory to exist in the repository.
 *
 * Usage in Jenkinsfile:
 *
 * @Library('webdriverio-pipeline') _
 *
 * pipeline {
 *     agent any
 *     stages {
 *         stage('E2E Tests') {
 *             steps {
 *                 webdriverioTests(
 *                     baseUrl: 'http://localhost:3000',
 *                     executionMode: 'docker'
 *                 )
 *             }
 *         }
 *     }
 * }
 *
 * Or as a standalone call:
 *
 * webdriverioTests()
 */

def call(Map config = [:]) {
    // Default configuration
    def defaults = [
        workingDirectory: 'webdriver-io',
        baseUrl: 'http://localhost:3000',
        executionMode: 'docker',  // docker, local, cloud
        maxInstances: 5,
        browsers: ['chrome'],
        uploadArtifacts: true,
        failOnError: true,
        nodeVersion: '18'
    ]

    // Merge defaults with provided config
    config = defaults + config

    echo "Running WebDriverIO E2E Tests"
    echo "  Working Directory: ${config.workingDirectory}"
    echo "  Base URL: ${config.baseUrl}"
    echo "  Execution Mode: ${config.executionMode}"
    echo "  Max Instances: ${config.maxInstances}"

    // Verify WebDriverIO setup exists
    if (!fileExists(config.workingDirectory)) {
        error "WebDriverIO directory not found at ${config.workingDirectory}. Please ensure the WebDriverIO template has been applied to this repository."
    }

    def testResult = 'SUCCESS'

    try {
        dir(config.workingDirectory) {
            switch(config.executionMode) {
                case 'docker':
                    runDockerTests(config)
                    break
                case 'local':
                    runLocalTests(config)
                    break
                case 'cloud':
                    runCloudTests(config)
                    break
                default:
                    error "Unknown execution mode: ${config.executionMode}"
            }
        }
    } catch (Exception e) {
        testResult = 'FAILURE'
        if (config.failOnError) {
            throw e
        } else {
            echo "E2E tests failed but failOnError is false, continuing..."
            unstable(message: "E2E tests failed: ${e.message}")
        }
    } finally {
        // Collect artifacts
        if (config.uploadArtifacts) {
            collectArtifacts(config)
        }

        // Cleanup
        if (config.executionMode == 'docker') {
            dir(config.workingDirectory) {
                sh 'docker-compose down -v || true'
            }
        }
    }

    return testResult
}

def runDockerTests(Map config) {
    echo "Running E2E tests in Docker mode..."

    withEnv([
        "BASE_URL=${config.baseUrl}",
        "MAX_INSTANCES=${config.maxInstances}"
    ]) {
        sh '''
            docker-compose up --build --abort-on-container-exit --exit-code-from wdio-tests
        '''
    }
}

def runLocalTests(Map config) {
    echo "Running E2E tests in Local mode..."

    nodejs(nodeJSInstallationName: "NodeJS-${config.nodeVersion}") {
        sh 'npm ci'

        withEnv([
            "BASE_URL=${config.baseUrl}",
            "MAX_INSTANCES=${config.maxInstances}",
            "HEADLESS=true"
        ]) {
            sh 'npm run test:e2e'
        }
    }
}

def runCloudTests(Map config) {
    echo "Running E2E tests in Cloud mode (BrowserStack)..."

    nodejs(nodeJSInstallationName: "NodeJS-${config.nodeVersion}") {
        sh 'npm ci'

        withCredentials([
            string(credentialsId: 'browserstack-username', variable: 'BROWSERSTACK_USERNAME'),
            string(credentialsId: 'browserstack-access-key', variable: 'BROWSERSTACK_ACCESS_KEY')
        ]) {
            withEnv([
                "BASE_URL=${config.baseUrl}",
                "MAX_INSTANCES=${config.maxInstances}"
            ]) {
                sh 'npm run test:e2e:cloud'
            }
        }
    }
}

def collectArtifacts(Map config) {
    echo "Collecting test artifacts..."

    // Archive test results
    archiveArtifacts(
        artifacts: "${config.workingDirectory}/test-results/**/*",
        allowEmptyArchive: true,
        fingerprint: true
    )

    // Archive Allure results
    archiveArtifacts(
        artifacts: "${config.workingDirectory}/allure-results/**/*",
        allowEmptyArchive: true,
        fingerprint: true
    )

    // Publish JUnit results
    junit(
        testResults: "${config.workingDirectory}/test-results/*.xml",
        allowEmptyResults: true
    )

    // Publish Allure report if plugin is available
    try {
        allure([
            includeProperties: false,
            jdk: '',
            results: [[path: "${config.workingDirectory}/allure-results"]]
        ])
    } catch (Exception e) {
        echo "Allure plugin not available, skipping report generation"
    }
}

return this
