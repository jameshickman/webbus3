class ComponentFactory {
	constructor(w, n, e, p) {
		this.web_bus = w;
		this.nme = n;
		this.el = e;
		this.params = p;
	}
	_setup() {};
	_start() {};
}

export default ComponentFactory;