class ComponentFactory {
	constructor(w, n, e, p) {
		this.web_bus = w;
		this.nme = n;
		this.el = e;
		this.params = p;
	}
	_setup() {};
	_start() {};

	/**
	 * Create a new Event
	 * 
	 * @param {string} name 
	 * @param {CallableFunction} fn 
	 */
	create_handler(name, fn) {
		this["event_" + name] = fn;
	}
}

export default ComponentFactory;