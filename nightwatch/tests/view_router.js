module.exports = {
    'step one: Load Router example': function(browser) {
        browser
        .url("http://localhost:8080/components/page_router/#views/view/page1|test/var/1")
        .waitForElementVisible('body', 1000)
        .pause(1)
    },
    'step two: Navigate between Views': function(browser) {
        browser.click('#navigation a:nth-of-type(3)').pause(1);
        browser.isVisible('#views div:nth-of-type(3) h2');
        browser.assert.urlContains('#views/view/page3|test/var/1');
        browser.assert.hasClass('#navigation a:nth-of-type(3)', 'navigation__link__current');
        browser.assert.not.hasClass('#navigation a:nth-of-type(1)', 'navigation__link__current');
        browser.back().pause(1);
        browser.assert.urlContains('#views/view/page1|test/var/1');
        browser.assert.hasClass('#navigation a:nth-of-type(1)', 'navigation__link__current');
        browser.assert.not.hasClass('#navigation a:nth-of-type(3)', 'navigation__link__current');
    }
}