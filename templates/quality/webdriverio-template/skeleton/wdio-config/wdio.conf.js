/**
 * WebdriverIO Configuration File
 * Generated for project: ${{ values.projectName }}
 */

const path = require('path');

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
        path.join(__dirname, '../tests/specs/**/*.js')
    ],
    exclude: [],

    //
    // ============
    // Capabilities
    // ============
    maxInstances: ${ { values.maxInstances or 5 } },

capabilities: [
    {% for browser in values.browsers %}
{
    browserName: '{{ browser }}',
        {% if values.headless and browser in ['chrome', 'firefox'] %}
'goog:chromeOptions': {
    args: [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--window-size=1920,1080'
    ],
        binary: process.env.CHROME_BIN || undefined
},
{% endif %}
acceptInsecureCerts: true,
    maxInstances: ${ { values.maxInstances or 5 } }
        }{% if not loop.last %}, {% endif %}
{% endfor %}
    ],

//
// ===================
// Test Configurations
// ===================
logLevel: process.env.LOG_LEVEL || 'info',
    bail: 0,
        baseUrl: process.env.BASE_URL || '${{ values.baseUrl }}',
            waitforTimeout: 10000,
                connectionRetryTimeout: 120000,
                    connectionRetryCount: 3,

                        //
                        // =======
                        // Services
                        // =======
                        services: [
                            {% if values.executionMode == 'local' or values.executionMode == 'docker' %}
['chromedriver', {
    chromedriverCustomPath: process.env.CHROMEDRIVER_PATH || undefined
}]
{% elif values.executionMode == 'cloud' %}
['browserstack']
{% endif %}
    ],

//
// ========
// Framework
// ========
framework: '${{ values.testFramework }}',
    {% if values.testFramework == 'mocha' %}
mochaOpts: {
    ui: 'bdd',
        timeout: ${ { values.testTimeout or 60000 } },
    require: [require.resolve('@babel/register')]
},
{% elif values.testFramework == 'jasmine' %}
jasmineOpts: {
    defaultTimeoutInterval: ${ { values.testTimeout or 60000 } },
    helpers: [require.resolve('@babel/register')]
},
{% elif values.testFramework == 'cucumber' %}
cucumberOpts: {
    require: [path.join(__dirname, '../tests/step-definitions/**/*.js')],
        backtrace: false,
            requireModule: [require.resolve('@babel/register')],
                dryRun: false,
                    failFast: false,
                        snippets: true,
                            source: true,
                                strict: false,
                                    tagExpression: '',
                                        timeout: ${ { values.testTimeout or 60000 } },
    ignoreUndefinedDefinitions: false
},
{% endif %}

//
// =========
// Reporters
// =========
reporters: [
    {% for reporter in values.reporters %}
{% if reporter == 'spec' %}
'spec'{% if not loop.last %}, {% endif %}
{% elif reporter == 'dot' %}
'dot'{% if not loop.last %}, {% endif %}
{% elif reporter == 'allure' %}
['allure', {
    outputDir: 'allure-results',
    disableWebdriverStepsReporting: false,
    disableWebdriverScreenshotsReporting: false
}]{% if not loop.last %}, {% endif %}
{% elif reporter == 'junit' %}
['junit', {
    outputDir: './test-results',
    outputFileFormat: function (options) {
        return `results-${options.cid}.${options.capabilities}.xml`
    }
}]{% if not loop.last %}, {% endif %}
{% endif %}
{% endfor %}
    ],

//
// =====
// Hooks
// =====
/**
 * Gets executed before test execution begins
 */
before: function (capabilities, specs) {
    {% if values.testFramework == 'mocha' or values.testFramework == 'jasmine' %}
    const chai = require('chai');
    global.assert = chai.assert;
    global.should = chai.should();
    global.chaiExpect = chai.expect;

    if (typeof expect === 'undefined') {
        const { expect: wdioExpect } = require('expect-webdriverio');
        global.expect = wdioExpect;
    }
    {% endif %}
},

afterTest: async function(test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const testName = test.title.replace(/\s+/g, '_');
            const filename = path.join(__dirname, `../test-results/screenshots/${testName}_${timestamp}.png`);
            await browser.saveScreenshot(filename);
        } catch (err) {
            console.error('Failed to take screenshot:', err);
        }
    }
}
};
