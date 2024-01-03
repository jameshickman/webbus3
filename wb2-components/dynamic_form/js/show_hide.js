/*
 * Configurable literner for a form section.
 *
 * Configuration object mandatory:
 *      event: Name of event to listen for
 *      values: Array of values to listen for and show the element
 *      hideClass: Calss to apply to hide the section, optional,
 *          defaults to 'webbus__hide-section'
 *      custom_logic: If factory in a wrapper factory pass custom
 *          function to preform arbitrary logic to determine the show/hide state.
 *          Return true/false.
 *
 * Listens for 'event_form_reset' to reset the section, hide it.
 */

function webbus__form_show_hide_listener(web_bus, name, el, params, custom_logic) {
    var hideClass = null;

    this._setup = function() {
        setup();
    };
    this._start = function() {};

    this[params.event] = function(v) {
        if (typeof custom_logic === "function") {
            var flag = custom_logic(web_bus, name, el, params, v);
            if (flag) {
                el.classList.remove(hideClass);
            }
            else {
                el.classList.add(hideClass);
            }
        }
        else {
            var match = params.values.filter(value => value == v.value).length > 0;
            if (match) {
                el.classList.remove(hideClass);
            }
            if (
                (!match && !v.multi) ||
                (match && v.multi && v.state === false)
            ) {
                el.classList.add(hideClass);
            }
        }
    }

    this.event_form_reset = function(d) {
        el.classList.add(hideClass);
    }

    function setup() {
        if (!params.hasOwnProperty('hideClass')) {
            hideClass = "webbus__hide-section";
        }
        else {
            hideClass = params.hideClass;
        }
        el.classList.add(hideClass);
    }

    return this;
}
