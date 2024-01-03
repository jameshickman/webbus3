module.exports = {
    'step one: Load the message-passing example': function(browser) {
        browser
        .url('http://localhost:8080/tests/messaging/')
        .waitForElementVisible('body', 1000)
        .pause(1)
    },
    'step two: Send a message to all listeners': function(browser) {
        browser.click('.button_send_all');
        browser.pause(1);
        browser.assert.textContains('#listener-1 div:nth-of-type(1)', "Bradcast to all listeners.");
        browser.assert.textContains('#listener-2 div:nth-of-type(1)', "Bradcast to all listeners.");
        browser.assert.textContains('#listener-3 div:nth-of-type(1)', "Bradcast to all listeners.");
    },
    'step three: Send to first listener': function(browser) {
        browser.click('.button_send_first').pause(1);
        browser.assert.textContains('#listener-1 div:nth-of-type(2)', "Bradcast first container.");
    },
    'step four: Send to targets in container': function(browser) {
        browser.click('.button_send_second').pause(1);
        browser.assert.textContains('#listener-2 div:nth-of-type(2)', "Bradcast second container.");
        browser.assert.textContains('#listener-3 div:nth-of-type(2)', "Bradcast second container.");
    },
    'step five: Responses from handlers': function(browser) {
        browser.click('.button_get_response').pause(1);
        browser.assert.textContains('.response', '{"listener-1":"Instance: listener-1","listener-2":"Instance: listener-2","listener-3":"Instance: listener-3"}');
    }
}