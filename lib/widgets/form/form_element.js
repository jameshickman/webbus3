import ComponentFactory from "../../component";

class FormElement extends ComponentFactory {
    element = null;
    el_validation_message = null;
    element_type = '';
    _setup() {
        this.el_validation_message = this.el.querySelector(".validation-message");
        // Check-boxes
        const els_checkboxes = this.el.querySelectorAll("input[type=checkbox]");
        if (els_checkboxes.length > 0) {
            this.element_type = "checkbox";
            this.element = els_checkboxes;
            els_checkboxes.map((el_checkbox) => {
                el_checkbox.addEventListener("change", this.widget_changed);
            });
            return;
        }
        // Radio controls
        const els_radios = this.el.querySelectorAll("input[type=radio]");
        if (els_radios.length > 0) {
            this.element_type = "radio";
            this.element = els_radios;
            els_radios.map((el_radio) => {
                el_radio.addEventListener("change", this.widget_changed);
            });
            return;
        }
        // Select
        const el_select = this.el.querySelector("SELECT");
        if (el_select) {
            this.element_type = "select";
            this.element = el_select;
            el_select.addEventListener("change", this.widget_changed);
            return;
        }
        // Text or number input
        const el_input = this.el.querySelector("INPUT");
        if (el_input) {
            this.element_type = "input";
            this.element = el_input;
            el_input.addEventListener("change", this.widget_changed);
            return;
        }
        // Textarea
        const el_textarea = this.el.querySelector("TEXTAREA");
        if (el_textarea) {
            this.element_type = "textarea";
            this.element = el_textarea;
            el_textarea.addEventListener("change", this.widget_changed);
            return;
        }
    }

    event_get_value () {
        switch(this.element_type) {
            case 'checkbox':
            case 'radio':
                const values = {
                    'element': this.element,
                    'value': []
                };
                this.element.map((el_input) => {
                    if (el_input.checked) {
                        values.value.push(el_input.value);
                    }
                });
                return values;
            case 'select':
                if (this.element.prop('multiple') === false) {
                    return {
                        'element': this.element,
                        'value': this.element.value
                    };
                }
                else {
                    const values = {
                        'element': this.element,
                        'value': []
                    };
                    this.element.selectedOptions.map((el_option) => {
                        values.value.push(el_option.value);
                    });
                    return values;
                }
            default:
                return {
                    'element': this.element,
                    'value': this.element.value
                };
        }
    }

    event_set_values(values) {
        if (values.hasOwnProperty(this.nme)) {
            // There is a value for this form element
        }
    }

    event_validate() {

    }

    event_validation_reset() {

    }

    widget_changed() {

    }
}

export default FormElement