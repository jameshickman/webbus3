class WebBus {
    #prototypes = {};
    #components = {};
    #hydration = {};
    #page_config = {};
    #el_root = null;
    extensions = null;

    constructor(environ_o, el_root) {
        if (el_root !== undefined) {
            this.#el_root = el_root;
        }
        else {
            this.#el_root = document;
        }
        if (environ_o.hasOwnProperty('page')) this.#page_config = environ_o.page;
        if (environ_o.hasOwnProperty('factories')) this.#prototypes = environ_o.factories;
        if (environ_o.hasOwnProperty('extensions')) this.extensions = environ_o.extensions;
        this.throttledVisibilityCheck = this.#throttle(this.visibility_check.bind(this), 100);
        this.#setup();
    }

    /**
     * Send an event to one or more Controller instances.
     * The handler path is either the name of the handler to call on all Controllers
     * or is a uery selector string to select a subsection of the DOM seperated from
     * the handler name via a slash.
     * 
     * The return is an object that has keys that are the names of each instance called,
     * and any data frturned from the handler method.
     * 
     * @param {string} handler_path 
     * @param {object} data 
     * @returns {
     *      {string} Romponent name.
     *      {object} Return ed data
     * }
     */
    fire_event(handler_path, data) {
        let handler = '', path = '.webbus_container';
		const split_at = handler_path.lastIndexOf('/');
		if (split_at == -1) {
		 	handler = handler_path;
		}
		else {
		 	path = handler_path.substring(0, split_at);
		 	handler = handler_path.substring(split_at + 1);
            if (handler.charAt(0) === '$') {
                handler = handler.substring(1);
                path = path + '.webbus_container';
            }
            else {
                path = path + ' .webbus_container';
            }
		}
        if (handler.substring(0, 6) !== 'event_') handler = 'event_' + handler;
		const results = {};
        const els_targets = this.#el_root.querySelectorAll(path);
        for (const el_target of els_targets) {
            if (el_target.hasOwnProperty('webbus_controller')) {
                const n_id = el_target.id;
                if (handler in this.#components[n_id].controller) {
                    if (!this.#hydration[n_id]) {
                        this.#hydration[n_id] = true;
                        this.#components[n_id].controller._start.bind(this.#components[n_id].controller)();
                    }
                    try {
                        results[n_id] = this.#components[n_id].controller[handler].bind(this.#components[n_id].controller)(data);
                    }
                    catch(err) {
                        results[n_id] = {"__ERROR__": err}
                        console.log(err);
                    }
                }
            }
        }
        return results;
    }

    /**
     * Retrieve a global scoped configuration item passed when the WebBus object is created.
     * 
     * @param {string} key 
     * @returns string value
     */
    page_config(key) {
        return this.#page_config[key];
    }

    /**
     * Public interface for creating a component instance
     * 
     * @param {string} cname is the unique name of the instance
     * @param {string} logic is the name of the Controller class
     * @param {HTMLElement} dom_element is the html element the instance is controlling
     * @param {object} params 
     */
    boot_component(cname, logic, dom_element, params) {
        this.#construct_component(cname, logic, dom_element, params);
        this.#components[cname].controller._setup();
    }

    /**
     * Force a recheck for hydration.
     * May be used for advanced application navigation
     * techniques such as tabed views.
     */
    visibility_check() {
        for (const component in this.#components) {
            if (!this.#hydration[component]) {
                if (this.#is_visible(this.#components[component].element)) {
                    this.#hydration[component] = true;
                    this.#components[component].controller._start.bind(this.#components[component].controller)();
                }
            }
        }
    }

    #construct_component(cname, logic, dom_element, params) {
        if (this.#components.hasOwnProperty(cname)) {
            throw new Error("Duplicate instance ID defined: " + cname);
        }
        if (this.#prototypes.hasOwnProperty(logic)) {
            this.#components[cname] = {
                'controller': new this.#prototypes[logic](this, cname, dom_element, params),
                'element': dom_element
            };
            dom_element.webbus_controller = this.#components[cname];
            this.#hydration[cname] = false;
        }
    }

    #is_visible(el) {
        if (el === null) {
            throw new Error("Visibility check with a null element.");
        }
        const bbox = el.getBoundingClientRect();
		const h = window.innerHeight;
		if (bbox.y < h) {
			let el_current = el;
			while(el_current.parentElement) {
				if (
                    el_current.style.display === 'none'
                    || el_current.style.visibility === 'collapse'
                    || el_current.style.visibility === 'hidden'
                ) {
					return false;
				}
				el_current = el_current.parentElement;
			}
		}
		else {
			return false;
		}
		return true;
    }

    #throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }

    #setup() {
        document.addEventListener('scroll', this.throttledVisibilityCheck);
        const widgets = this.#el_root.querySelectorAll('.webbus_container');
        for (let i = 0; i < widgets.length; i++) {
            const id = widgets[i].id;
            if (id === null) {
                throw new Error("WebBus instance MUST have a unique ID on element")
            }
            const logic = widgets[i].getAttribute('DATA-LOGIC');
            let params = widgets[i].getAttribute('DATA-PARAMS');
            if (!params) {
                const n_config = widgets[i].getElementsByTagName("CONFIG");
                if (n_config.length > 0) {
                    params = n_config[0].innerHTML;
                }
            }
            let param_o = {};
            if (params && params.length > 0) {
                try {
                    param_o = JSON.parse(params)
                }
                catch(err) {
                    console.log("WebBus ERROR: Cannot parse params for '" + id + "'");
                }
            }
            this.#construct_component(id, logic, widgets[i], param_o);
        }
        for (const component in this.#components) {
            this.#components[component].controller._setup.bind(this.#components[component].controller)();
        }
        this.visibility_check();
    }
}

export default WebBus;