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

    }

    event_set_values(values) {

    }

    event_validate() {

    }

    event_validation_reset() {

    }

    event_clear_form_repeater() {

    }

    #find_repeater(el) {
        while(el.parentNode !== null) {
            if(el.dataset.repeater) return el;
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
    }
}

export default FormRepeater;