class ComponentFactory {
	constructor(w, n, e, p) {
		this.web_bus = w;
		this.nme = n;
		this.el = e;
		this.params = p;
	}
	_setup() {};
	_start() {};

	persistant_callback(callback) {
		if (this.web_bus.extensions !== null && this.web_bus.extensions.hasOwnProperty('persist_inst')) {
			return this.web_bus.extensions.persist_inst.create(this.nme, callback);
		}
		return false;
	}

	persistance_set(values) {
		if (this.web_bus.extensions !== null && this.web_bus.extensions.hasOwnProperty('persist_inst')) {
			this.web_bus.extensions.persist_inst.set(this.nme, values);
		}
		return false;
	}

	persistance_get(key) {
		if (this.web_bus.extensions !== null && this.web_bus.extensions.hasOwnProperty('persist_inst')) {
			return this.web_bus.extensions.persist_inst.get(this.nme, key);
		}
		return false;
	}
}

export default ComponentFactory;