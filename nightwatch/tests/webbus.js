module.exports = {
    'step one: Load the hello world': function(browser) {
        browser
        .url('http://localhost:8080/tests/hello_world/')
        .waitForElementVisible('body', 1000)
        .pause(1)
    },
    'step two: verify configuration level variable': function(browser) {
        // browser.debug();
        browser.assert.textContains('#output_1', "From setup method. Configuration value: 123");
    },
    'step three: verify page level variable': function(browser) {
        browser.assert.textContains('#output_2', "From start method. Global page value: 98765");
    }
}