import FormElement from "./form_element.js";

class TrinaryElement extends FormElement {
    #true_value;
    #false_value;
    #lbl_yes;
    #lbl_nutral;
    #lbl_no;
    #el_button_yes;
    #el_button_no;
    #el_button_nutral;

    constructor(w, n, e, p) {
        super(w, n, e, p);
        this.setup_hooks.push(this.#setup_widget);
        if (this.params.hasOwnProperty('true_value')) this.#true_value = this.params.true_value;
        if (this.params.hasOwnProperty('false_value')) this.#false_value = this.params.false_value;
        if (this.params.hasOwnProperty('lbl_yes')) {
            this.#lbl_yes = this.params.lbl_yes;
        }
        else {
            this.#lbl_yes = "Yes";
        }
        if (this.params.hasOwnProperty('lbl_nutral')) {
            this.#lbl_nutral = this.params.lbl_nutral;
        }
        else {
            this.#lbl_nutral = "...";
        }
        if (this.params.hasOwnProperty('lbl_no')) {
            this.#lbl_no = this.params.lbl_no;
        }
        else {
            this.#lbl_no = "No";
        }
        this.#setup_widget();
    }

    event_reset_state() {
        this.#set_state(this.get_value());
    }

    #set_state(state) {
        if (state === this.#true_value) {
            this.#el_button_yes.classList.add("trinary__button_selected_yes");
            this.#el_button_no.classList.remove("trinary__button_selected_no");
            this.#el_button_nutral.classList.remove("trinary__button_selected_undefined");
        }
        else if (state === this.#false_value) {
            this.#el_button_no.classList.add("trinary__button_selected_no");
            this.#el_button_yes.classList.remove("trinary__button_selected_yes");
            this.#el_button_nutral.classList.remove("trinary__button_selected_undefined");
        }
        else {
            this.#el_button_yes.classList.remove("trinary__button_selected_yes");
            this.#el_button_no.classList.remove("trinary__button_selected_no");
            this.#el_button_nutral.classList.add("trinary__button_selected_undefined");
        }
    }

    #setup_widget() {
        this.element.style.display = 'none';
        const el_slider_container = document.createElement('div');
        el_slider_container.classList.add("trinary__widget_container");
        this.el.appendChild(el_slider_container);
        this.#el_button_no = document.createElement('button');
        this.#el_button_no.classList.add("trinary__option_no");
        this.#el_button_no.innerText = this.#lbl_no;
        this.#el_button_nutral = document.createElement('button');
        this.#el_button_nutral.classList.add("trinary__option_nutral")
        this.#el_button_nutral.innerText = this.#lbl_nutral;
        this.#el_button_yes = document.createElement('button');
        el_button_yes.classList.add("trinary__option_yes");
        el_button_yes.innerText = this.#lbl_yes;

        el_slider_container.appendChild(this.#el_button_no);
        el_slider_container.appendChild(this.#el_button_nutral);
        el_slider_container.appendChild(this.#el_button_yes);

        el_select.addEventListener('change', (e) => {
            this.#set_state(this.get_value());
        });
        this.#el_button_no.addEventListener('click', (e) => {
            this.element.value = this.#false_value;
            this.#set_state(this.#false_value);
        });
        this.#el_button_nutral.addEventListener('click', (e) => {
            this.element.value = '';
            this.#set_state();
        });
        this.#el_button_yes.addEventListener('click', (e) => {
            this.element.value = this.#true_value;
            this.#set_state(this.#true_value);
        });
    }
}

export default TrinaryElement;