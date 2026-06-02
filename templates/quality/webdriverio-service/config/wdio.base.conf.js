/**
 * WebdriverIO Base Configuration
 * Maintained by: Quality Platform Team
 *
 * This is a base configuration that provides sensible defaults.
 * Users can extend this configuration in their project-specific wdio.conf.js
 */

exports.config = {
    //
    // ==================
    // Runner Configuration
    // ==================
    runner: 'local',

    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './tests/specs/**/*.js',
        './tests/specs/**/*.ts'
    ],
    exclude: [
        './tests/specs/**/*.skip.js'
    ],

    //
    // ============
    // Capabilities
    // ============
    maxInstances: process.env.MAX_INSTANCES ? parseInt(process.env.MAX_INSTANCES) : 5,

    capabilities: [{
        browserName: process.env.BROWSER || 'chrome',
        'goog:chromeOptions': {
            binary: process.env.CHROME_BIN || '/usr/bin/chromium',
            args: [
                ...(process.env.HEADLESS !== 'false' ? ['--headless=new'] : []),
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--disable-extensions',
                '--window-size=1920,1080',
                // Performance optimizations
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding'
            ]
        },
        acceptInsecureCerts: true
    }],

    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: process.env.LOG_LEVEL || 'info',
    bail: process.env.BAIL === 'true' ? 1 : 0,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',

    // Timeouts
    waitforTimeout: parseInt(process.env.WAIT_TIMEOUT) || 10000,
    connectionRetryTimeout: parseInt(process.env.CONNECTION_RETRY_TIMEOUT) || 120000,
    connectionRetryCount: parseInt(process.env.CONNECTION_RETRY_COUNT) || 3,

    //
    // =======
    // Services
    // =======
    services: [
        ['chromedriver', {
            logFileName: 'wdio-chromedriver.log',
            outputDir: './test-results',
            args: ['--silent']
        }]
    ],

    //
    // ========
    // Framework
    // ========
    framework: process.env.TEST_FRAMEWORK || 'mocha',

    mochaOpts: {
        ui: 'bdd',
        timeout: parseInt(process.env.TEST_TIMEOUT) || 60000,
        require: ['@babel/register']
    },

    //
    // =========
    // Reporters
    // =========
    reporters: [
        'spec',
        ['allure', {
            outputDir: './allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false,
            useCucumberStepReporter: false
        }],
        ['junit', {
            outputDir: './test-results',
            outputFileFormat: function(options) {
                return `results-${options.cid}.${options.capabilities.browserName}.xml`
            }
        }]
    ],

    //
    // =====
    // Hooks
    // =====

    /**
     * Gets executed once before all workers get launched.
     */
    onPrepare: function (config, capabilities) {
        console.log('========================================');
        console.log('WebdriverIO Test Execution Starting');
        console.log('========================================');
        console.log('Base URL:', config.baseUrl);
        console.log('Browser:', capabilities[0].browserName);
        console.log('Headless:', process.env.HEADLESS !== 'false');
        console.log('Max Instances:', config.maxInstances);
        console.log('========================================\n');
    },

    /**
     * Gets executed before test execution begins
     */
    before: function (capabilities, specs) {
        // Set up global utilities
        const chai = require('chai');
        global.expect = chai.expect;
        global.assert = chai.assert;
        global.should = chai.should();

        // Set default timeouts
        browser.setTimeout({
            implicit: 5000,
            pageLoad: 30000,
            script: 30000
        });
    },

    /**
     * Gets executed after a test (in Mocha/Jasmine)
     * Take screenshots on test failure
     */
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${test.parent}-${test.title}-${timestamp}.png`
                .replace(/\s+/g, '-')
                .replace(/[^a-zA-Z0-9-_.]/g, '');

            await browser.saveScreenshot(`./test-results/screenshots/${filename}`);
        }
    },

    /**
     * Gets executed after all tests are done
     */
    onComplete: function(exitCode, config, capabilities, results) {
        console.log('\n========================================');
        console.log('WebdriverIO Test Execution Complete');
        console.log('Exit Code:', exitCode);
        console.log('========================================');
    }
};
