class EventListenerController extends ComponentFactory {
	_setup = () => {
		console.log("_setup called on " + this.nme);
	}

	_start = () => {
		console.log("_start called on " + this.nme);
	}

	event_test = (s) => {
		console.log("event_test on " + this.nme +" called and passed: " + s);
		var ne = document.createElement("div");
		ne.innerHTML = s;
		this.el.appendChild(ne);
	}

	event_respond_with_data = () => {
		return "Instance: " + this.nme;
	}
}