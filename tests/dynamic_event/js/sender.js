import ComponentFactory from "../../../lib/component.js";

class DynamicExampleTest extends ComponentFactory {
    #el_display = this.el.querySelector("#result");

    _setup() {
        this.el.querySelector("#test-event-call").addEventListener('click', (e) => {
            const rv = this.web_bus.fire_event("dynamic");
            this.#el_display.innerText = JSON.stringify(rv);
        });
    }

    _start() {}
}

export default DynamicExampleTest;