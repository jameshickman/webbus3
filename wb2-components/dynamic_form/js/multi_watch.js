/*
 * Watch a Select, Radio or Checkbox set for specific values and
 * fire the specified event on a change.
 *
 * Configuration object mandatory:
 *      event: Name of Event to broadcast, can be a Web Bus path specifier
 */

function webbus__form_change_watch(web_bus, name, el, params) {
    var el_fields = null;

    this._setup = function() {
        setup();
    };
    this._start = function() {
        init();
    };

    function on_change(e) {
        var payload = {
            value: e.currentTarget.value,
            multi: false,
            state: true,
            all_states: el_fields
        };
        if (
            (e.currentTarget.nodeName === "SELECT" && e.currentTarget.multiple) ||
            (e.currentTarget.nodeName === "INPUT" && e.currentTarget.type === "checkbox")
        ) {
            payload.multi = true;
        }
        if (e.currentTarget.checked === false) {
            payload.state = e.currentTarget.checked;
        }
        web_bus.fire_event(params.event, payload);
    }

    function setup() {
        el_fields = el.querySelectorAll("select, input[type=checkbox], input[type=radio]");
        for (var i = 0; i < el_fields.length; i++) {
            el_fields[i].addEventListener('change', on_change);
        }
    }

    function event_form_reloaded() {
        set_form_state();
    }

    function init() {
        set_form_state();
    }
    
    function set_form_state() {
        for (var i = 0; i < el_fields.length; i++) {
            var payload = {};
            if (el_fields[i].nodeName === "SELECT") {
                var multi = false;
                if (el_fields[i].multiple) {
                    multi = true;
                }
                for (var j = 0; j < el_fields[i].selectedOptions.length; j++) {
                    if(el_fields[i].selectedOptions[j].selected) {
                        payload = {
                            value: el_fields[i].selectedOptions[j].value,
                            multi: multi,
                            state: true
                        }
                        web_bus.fire_event(params.event, payload);
                    }
                }
            }
            else if (
                el_fields[i].nodeName === "INPUT" &&
                (
                    el_fields[i].type === "checkbox" ||
                    el_fields[i].type === "radio"
                ) &&
                el_fields[i].checked
            ) {
                payload = {
                    value: el_fields[i].value,
                    multi: false,
                    state: true
                };
                if (el_fields[i].type === "checkbox") {
                    payload.multi = true;
                }
                web_bus.fire_event(params.event, payload);
            }
        }
    }

    return this;
}
