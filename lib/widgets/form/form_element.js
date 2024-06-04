import ComponentFactory from "../../component.js";

class FormElement extends ComponentFactory {
    element = null;
    el_validation_message = null;
    element_type = '';
    setup_hooks = [];
    change_hooks = [];
    _setup() {
        this.el_validation_message = this.el.querySelector(".validation-message");
        // Check-boxes
        let found = false;
        const els_checkboxes = this.el.querySelectorAll("input[type=checkbox]");
        if (els_checkboxes.length > 0) {
            this.element_type = "checkbox";
            this.element = els_checkboxes;
            Array.from(els_checkboxes).map((el_checkbox) => {
                el_checkbox.addEventListener("change", this.widget_changed.bind(this));
            });
            found = true;
        }
        // Radio controls
        const els_radios = this.el.querySelectorAll("input[type=radio]");
        if (els_radios.length > 0 && !found) {
            this.element_type = "radio";
            this.element = els_radios;
            Array.from(els_radios).map((el_radio) => {
                el_radio.addEventListener("change", this.widget_changed.bind(this));
            });
            found = true;
        }
        // Select
        const el_select = this.el.querySelector("SELECT");
        if (el_select && !found) {
            this.element_type = "select";
            this.element = el_select;
            el_select.addEventListener("change", this.widget_changed.bind(this));
            found = true;
        }
        // Text or number input
        const el_input = this.el.querySelector("INPUT");
        if (el_input && !found) {
            this.element_type = "input";
            this.element = el_input;
            el_input.addEventListener("change", this.widget_changed.bind(this));
            found = true;
        }
        // Textarea
        const el_textarea = this.el.querySelector("TEXTAREA");
        if (el_textarea && !found) {
            this.element_type = "textarea";
            this.element = el_textarea;
            el_textarea.addEventListener("change", this.widget_changed.bind(this));
        }
        for (let i = 0; i < this.setup_hooks.length; i++) {
            this.setup_hooks[i].bind(this)();
        }
    }

    /**
     * Get the value
     * 
     * @returns Return the element and it's value
     */
    event_get_value () {
        return {
            'element': this.element,
            'value': get_value()
        }
    }

    /**
     * Set the element value
     * 
     * @param {Object} values Properties are the name of the element and values are a scaler or list depending on the element
     */
    event_set_values(values) {
        if (values.hasOwnProperty(this.element.name)) {
            // There is a value for this form element
            const v = values[this.element.name];
            switch(this.element_type) {
                case 'checkbox':
                    if (v) {
                        this.element.checked = true;
                    }
                    else {
                        this.element.checked = false;
                    }
                    break;
                case 'radio':
                    this.element.map((el_rb) => {
                        if (el_rb.name === v) {
                            el_rb.checked = true;
                        }
                        else {
                            el_rb.checked = false;
                        }
                    });
                    break;
                case 'select':
                    if (this.element.prop('multiple') === false) {
                        this.element.value = v;
                    }
                    else {
                        this.element.children.map((el_option) => {
                            if (v.contains(el_option.value)) {
                                el_option.setAttribute('selected', 'selected');
                            }
                            else {
                                el_option.removeAttribute('selected');
                            }
                        });
                    }
                    break;
                default:
                    this.element.value = v;
            }
        }
    }

    /**
     * Run the validation and set the message for the failing validation test
     */
    event_validate() {
        return this.do_validation();
    }

    event_validation_reset() {
        this.el_validation_message.innerText = '';
    }

    /**
     * Get the value(s) of the control
     * 
     * @returns value or array of values
     */
    get_value () {
        switch(this.element_type) {
            case 'checkbox':
            case 'radio':
                const value = [];
                Array.from(this.element).map((el_input) => {
                    if (el_input.checked) {
                        value.push(el_input.value)
                    }
                });
                return value;
            case 'select':
                if (this.element.multiple === false) {
                    return this.element.options[this.element.selectedIndex].value;
                }
                else {
                    const value = [];
                    Array.from(this.element.selectedOptions).map((el_option) => {
                        value.push(el_option.value);
                    });
                    return value;
                }
            default:
                return this.element.value;
        }
    }

    widget_changed() {
        const validation_result = this.validate();
        for (let i = 0; i < this.change_hooks.length; i++) {
            this.change_hooks[i].bind(this)(validation_result);
        }
        if (this.params.hasOwnProperty('value_changed_event')) {
            this.web_bus.fire_event(this.params.value_changed_event, validation_result);
        }
    }

    do_validation() {
        this.el_validation_message.innerText = '';
        const validation_result = this.validate();
        if (validation_result === true) return {
            'validation': true,
            'name': this.element.name
        };
        this.el_validation_message.innerText = validation_result;
        return {
            'validation': false,
            'name': this.element.name,
            'message': validation_result
        }
    }

    validate() {
        if (this.params.hasOwnProperty('validation')) {
            switch(this.element_type) {
                case 'checkbox':
                case 'radio':
                    let checked_count = 0;
                    for (const el_item of this.element) {
                        if (el_item.checked) checked_count += 1;
                    }
                    if (this.params.validation.hasOwnProperty('required') && checked_count === 0) {
                        return this.params.validate.required;
                    }
                    if (this.params.validation.hasOwnProperty('minimum') && this.params.validation.minimum.count > checked_count) {
                        return this.params.validation.minimum.message;
                    }
                    break;
                case 'select':
                    if (this.element.multiple === false) {
                        if (this.params.validation.hasOwnProperty('required') && this.element.value === '') {
                            return this.params.validate.required;
                        }
                    }
                    else {
                        if (this.validate.hasOwnProperty('minimum')) {
                            if (this.params.validation.minimum.count > this.element.selectedOptions.length) {
                                return this.params.validation.minimum.message;
                            }
                        }
                    }
                    break;
                default:
                    if (this.params.validation.hasOwnProperty('required') && this.element.value === '') {
                        return this.params.validate.required;
                    }
                    if (this.params.validation.hasOwnProperty('minimum') && this.params.validation.minimum.count > this.element.value.length) {
                        return this.params.validation.minimum.message;
                    }
                    if (this.params.validation.hasOwnProperty('regex')) {
                        const r = new RegExp(this.params.validate.regex.expression);
                        if (!r.test(this.element.value)) return this.params.validate.regex.message;
                    }
                    if (this.params.validate.hasOwnProperty('range')) {
                        const v = parseFloat(this.element.value);
                        if (v < this.params.validate.range.lower || v > this.params.validate.range.upper) {
                            return this.params.validate.range.message;
                        }
                    }
                    break;
            }
        }
        return true;
    }
}

export default FormElement;