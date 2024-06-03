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
        const els_checkboxes = this.el.querySelectorAll("input[type=checkbox]");
        if (els_checkboxes.length > 0) {
            this.element_type = "checkbox";
            this.element = els_checkboxes;
            els_checkboxes.map((el_checkbox) => {
                el_checkbox.addEventListener("change", this.widget_changed.bind(this));
            });
        }
        // Radio controls
        const els_radios = this.el.querySelectorAll("input[type=radio]");
        if (els_radios.length > 0) {
            this.element_type = "radio";
            this.element = els_radios;
            els_radios.map((el_radio) => {
                el_radio.addEventListener("change", this.widget_changed.bind(this));
            });
        }
        // Select
        const el_select = this.el.querySelector("SELECT");
        if (el_select) {
            this.element_type = "select";
            this.element = el_select;
            el_select.addEventListener("change", this.widget_changed.bind(this));
        }
        // Text or number input
        const el_input = this.el.querySelector("INPUT");
        if (el_input) {
            this.element_type = "input";
            this.element = el_input;
            el_input.addEventListener("change", this.widget_changed.bind(this));
        }
        // Textarea
        const el_textarea = this.el.querySelector("TEXTAREA");
        if (el_textarea) {
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
     * Get the value(s) of the control
     * 
     * @returns value or array of values
     */
    get_value () {
        switch(this.element_type) {
            case 'checkbox':
            case 'radio':
                const value = [];
                this.element.map((el_input) => {
                    if (el_input.checked) {
                        value.push(el_input.value);
                    }
                });
                return value;
            case 'select':
                if (this.element.prop('multiple') === false) {
                    return this.element.value;
                }
                else {
                    const value = [];
                    this.element.selectedOptions.map((el_option) => {
                        value.push(el_option.value);
                    });
                    return value;
                }
            default:
                return his.element.value;
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

    event_validation_reset() {
        this.el_validation_message.innerText = '';
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

    validate() {
        if (this.params.hasOwnProperty('validation')) {
            const v = this.element.value;
            if (this.params.validation.hasOwnProperty('required') && v == '') return this.params.validation.required;
            else if (this.params.validation.hasOwnProperty('min_length') && v.length < parseInt(this.params.validation.min_length.count)) {
                return this.params.validation.min_length.message;
            }
            else if (
                this.params.validation.hasOwnProperty('range')
                && 
                (
                    parseFloat(v) < parseFloat(this.params.validate.range.lower)
                    || parseFloat(v) > parseFloat(this.params.validation.range.upper)
                )
            ) {
                return this.params.validation.range.message;
            }
            else if (this.params.validation.hasOwnProperty('regex')) {
                const r = new RegExp(this.params.validate.regex.expression);
                if (!r.test(v)) return this.params.validate.regex.message;
            }
        }
        return true;
    }
}

export default FormElement;