class HelloWorld extends ComponentFactory {
    #el_container = null;
    _setup() {
        this.#el_container = this.el.querySelector('.content');
        const el_paragraph = document.createElement('P');
        el_paragraph.id = "output_1";
        el_paragraph.innerText = "From setup method. Configuration value: " + this.params.var;
        this.#el_container.appendChild(el_paragraph);
    }

    _start() {
        const el_paragraph = document.createElement('P');
        el_paragraph.id = "output_2";
        el_paragraph.innerText = "From start method. Global page value: " + this.web_bus.page_config('pagevar');
        this.#el_container.appendChild(el_paragraph);
    }
}