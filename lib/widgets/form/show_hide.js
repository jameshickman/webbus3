import ComponentFactory from "../../component.js";

class ElementsContainer extends ComponentFactory {
    #hide_class = "webbus__hide-section";
    _setup() {
        if (this.params.hasOwnProperty("hide_class")) this.#hide_class = this.params.hide_class;
        this.create_handler(this.params.event, (values) => {
            let v = [];
            if (Array.isArray(values)) {
                v = values;
            }
            else {
                v = [values];
            }
            let match = false;
            for (let looking_for of this.params.values) {
                if (v.includes(looking_for)) {
                    match = true;
                    break;
                }
            }
            if (match) {
                this.el.classList.remove(this.#hide_class);
            }
            else {
                this.el.classList.add(this.#hide_class);
            }
        });
    }
}

export default ElementsContainer;