module.exports = {
    'step one: Load a REST paylod': function(browser) {
        browser
        .url('http://localhost:8080/tests/rest/')
        .waitForElementVisible('body', 1000)
        .pause(100)
        browser.assert.textContains('.result', '{"sample_string":"Hello World!","pi":3.14159}');
    }
}