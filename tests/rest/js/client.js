class RESTclientController extends ComponentFactory {
    #el_output;

    _setup() {
        this.#el_output = this.el.querySelector(".result");
    };

    _start() {
        this.web_bus.rest_call(
            this.params.url,
            "server_response",
            false
        )
    };

    event_server_response(d) {
        this.#el_output.innerText = JSON.stringify(d);
    }
}