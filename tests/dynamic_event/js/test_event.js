import ComponentFactory from "../../../lib/component.js";

class DynamicExample extends ComponentFactory {
    _setup() {
        this.create_event("dynamic", () => {
            return "Value from dynamic customer handler.";
        });
    }

    _start() {}
}

export default DynamicExample;