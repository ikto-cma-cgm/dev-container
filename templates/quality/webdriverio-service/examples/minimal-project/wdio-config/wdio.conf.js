/**
 * WebdriverIO Configuration File
 * Generated for project: my-awesome-app
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
        './tests/specs/**/*.js'
    ],
    exclude: [],

    //
    // ============
    // Capabilities
    // ============
    maxInstances: 5,

    capabilities: [
        {
            browserName: 'chrome',
            browserVersion: 'latest',
            'goog:chromeOptions': {
                args: ['--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
            },
            acceptInsecureCerts: true,
            maxInstances: 5
        }
    ],

    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost:3000',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    //
    // =======
    // Services
    // =======
    services: [
        ['chromedriver', {
            chromedriverCustomPath: undefined
        }]
    ],

    //
    // ========
    // Framework
    // ========
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
        require: ['@babel/register']
    },

    //
    // =========
    // Reporters
    // =========
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false
        }]
    ],

    //
    // =====
    // Hooks
    // =====
    /**
     * Gets executed before test execution begins
     */
    before: function (capabilities, specs) {
        // Set up global utilities, import chai, etc.
        const chai = require('chai');
        global.expect = chai.expect;
        global.assert = chai.assert;
        global.should = chai.should();
    },

    /**
     * Gets executed after a test (in Mocha/Jasmine) or scenario (in Cucumber)
     * Take screenshots on test failure
     */
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            await browser.takeScreenshot();
        }
    },

    /**
     * Gets executed after all tests are done
     */
    after: function (result, capabilities, specs) {
        // Clean up, close connections, etc.
    }
};
