import ComponentFactory from "../../component.js";
import UUIDv4 from "../../utility.js";

class FormRepeater extends ComponentFactory {
    #el_template;
    #el_repeater_container;
    #el_add_button;
    
    _setup() {
        this.#el_template = this.el.querySelector('template').content.children[0];
        this.#el_repeater_container = this.el.querySelector('.repeater-container');
        this.#el_add_button = this.el.querySelector('.add-repeater-button');
        this.#el_add_button.addEventListener('click', this.#add_repeater_clicked.bind(this));
    }

    event_get_values() {
        const values = [];
        for (const el of this.#el_repeater_container.children) {
            values.push(this.#form_values_in(el));
        }
        return values;
    }

    event_set_values(values) {

    }

    event_validate() {

    }

    event_validation_reset() {

    }

    event_clear_form_repeater() {

    }

    #form_values_in(el) {
        const values = {};
        const els_checkboxes = [...el.querySelectorAll("input[type=checkbox]"), ...el.querySelectorAll("input[type=raido]")];
        for (const el_checkbox of els_checkboxes) {
            if (el_checkbox.checked) {
                if (!values.hasOwnProperty(el_checkbox.name)) {
                    values[el_checkbox.name] = [];
                }
                values[el_checkbox.name].push(el_checkbox.value);
            }
        }
        const els_inputs = [
            ...el.querySelectorAll("input[type=text]"), ...el.querySelectorAll("input[type=number]"),
            ...el.querySelectorAll("input[type=date]"), ...el.querySelectorAll("input[type=tel]")
        ];
        for (const el_input of els_inputs) {
            values[el_input.name] = el_input.value;
        }
        const els_selects = el.querySelectorAll("select");
        for (const el_select of els_selects) {
            values[el_select.name] = el_select.value;
        }
        const els_textareas = el.querySelectorAll("textarea");
        for (const el_textarea of els_textareas) {
            values[el_textarea.name] = el_textarea.value;
        }
        return values;
    }

    #find_repeater(el) {
        while(el.parentNode !== null) {
            if(el.dataset.repeater) return el;
            el = el.parentNode;
        }
    }

    #delete_repeater_clicked(e) {
        const el_repeater_container = this.#find_repeater(e.currentTarget);
        el_repeater_container.parentNode.removeChild(el_repeater_container);
    }

    #add_repeater_clicked(e) {
        const update_ids = (el_container) => {
            const unique = UUIDv4();
            const el_label = el_container.querySelector('label');
            if (el_label) el_label.setAttribute('for', unique);
            const el_input = el_container.querySelector('input');
            if (el_input) el_input.id = unique;
            const el_select = el_container.querySelector('select');
            if (el_select) el_select.id = unique;
        }

        const el_new = this.#el_template.cloneNode(true);
        el_new.dataset['repeater'] = this.nme;
        const els_field_containers = el_new.querySelectorAll(".field-container");
        for(const el_field_container of els_field_containers) {
            update_ids(el_field_container);
        }
        el_new.querySelector(".delete-button").addEventListener('click', this.#delete_repeater_clicked.bind(this));
        this.#el_repeater_container.appendChild(el_new);
        e.preventDefault()
        return false;
    }
}

export default FormRepeater;