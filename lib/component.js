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
		return this.web_bus.persist_inst.create(this.nme, callback);
	}

	persistance_set(values) {
		this.web_bus.persist_inst.set(this.nme, values);
	}

	persistance_get(key) {
		return this.web_bus.persist_inst.get(this.nme, key);
	}
}