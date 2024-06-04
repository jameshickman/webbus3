import FormElement from "./form_element.js";

class WatchControlElement extends FormElement {
    constructor(w, n, e, p) {
        super(w, n, e, p);
        this.change_hooks.push(this.#set_state);
    }

    _start() {
        this.#set_state();
    }

    event_form_reset() {
        this.#set_state();
    }

    #set_state() {
        this.web_bus.fire_event(this.params.event, this.get_value());
    }
}

export default WatchControlElement;