class EventSendController extends ComponentFactory {
	#el_response_container;
	_setup = () => {
		console.log("_setup called on " + this.nme);
		this.#setup();
	}

	_start = () => {
		console.log("_start called on " + this.nme);
	}

	#setup = () => {
		this.#el_response_container = this.el.querySelector(".response");
		this.el.querySelector(".button_send_all").addEventListener("click", (e) => {
			this.web_bus.fire_event("test", "Bradcast to all listeners.");
		});
		
		this.el.querySelector(".button_send_first").addEventListener("click", (e) => {
			this.web_bus.fire_event("#container-1/test", "Bradcast first container.");
		});
		
		this.el.querySelector(".button_send_second").addEventListener("click", (e) => {
			this.web_bus.fire_event("#container-2/test", "Bradcast second container.");
		});
		this.el.querySelector(".button_get_response").addEventListener("click", (e) => {
			const reply = this.web_bus.fire_event("respond_with_data");
			this.#el_response_container.innerText = JSON.stringify(reply);
		});
	}
}
