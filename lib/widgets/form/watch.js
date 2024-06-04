import FormElement from "./form_element.js";

class WatchControlElement extends FormElement {
    constructor(w, n, e, p) {
        super(w, n, e, p);
        this.change_hooks.push(this.#set_state);
    }

    _start() {
        this.#set_state();
    }

    event_form_updated() {
        this.#set_state();
    }

    event_validate() {
        if (this.params.hasOwnProperty('validation_event')) {
            const sub_validations = this.web_bus.fire_event(this.params.validation_event);
            for (const n in sub_validations) {
                if (sub_validations[n] !== true) return false;
            }
            return true;
        }
        return this.do_validation();
    }

    #set_state() {
        this.web_bus.fire_event(this.params.event, this.get_value());
    }
}

export default WatchControlElement;