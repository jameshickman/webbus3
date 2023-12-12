/*
 * Pure ES6 implementation
 */

class WebBus {
    #prototypes = {};
    #components = {};
    #hydration = {};
    #dom_paths = {};
    #page_config = {};
    persist_inst = null;

    constructor(environ_o) {
        if (environ_o.hasOwnProperty('page')) this.#page_config = environ_o.page;
        if (environ_o.hasOwnProperty('factories')) this.#prototypes = environ_o.factories;
        if (window['WebBus_Persistence'] !== undefined) {
            this.persist_inst = new window['WebBus_Persistence']();
        }
        this.#setup();
    }

    /* Public API */
    fire_event(handler_path, data) {
        let handler = '', path = '';
		const split_at = handler_path.lastIndexOf('/');
		if (split_at == -1) {
		 	handler = handler_path;
		}
		else {
		 	// Path specified
		 	path = handler_path.substring(0, split_at);
		 	handler = handler_path.substring(split_at + 1);
		}
        // Require handler to start with 'event_'
        if (handler.substring(0, 6) !== 'event_') handler = 'event_' + handler;
		const results = {};
        for (const m in this.#components) {
            if (m != null && typeof this.#components[m] === 'object') {
                if (this.#components[m][handler] != null && typeof this.#components[m][handler] === 'function') {
                    if (path == '' || this.#path_match(path, this.#dom_paths[m])) {
                        if (!this.#hydration[m]) {
                            this.#hydration[m] = true;
                            this.#components[m]._start.bind(this.#components[m])();
                        }
                        try {
                            results[m] = this.#components[m][handler].bind(this.#components[m])(data);
                        }
                        catch(err) {
                            results[m] = {"__ERROR__": err}
                        }
                    }
                }
            }
        }
        return results;
    }

    page_config(key) {
        return this.#page_config[key];
    }

    boot_component(cname, logic, dom_element, params) {
        this.#construct(cname, logic, dom_element, params);
        this.#components[cname]._setup();
    }

    visibility_check() {
        for (const component in this.#components) {
            if (!this.#hydration[component]) {
                const el_instance = document.getElementById(component);
                if (this.#is_visible(el_instance)) {
                    this.#hydration[component] = true;
                    this.#components[component]._start.bind(this.#components[component])();
                }
            }
        }
    }

    rest_call(url, event_path, data, request_conf, is_form, failed) {
        if (window['simpleREST'] === undefined) return false;
        if (data === undefined) data = {};
        if (request_conf === undefined) request_conf = {};
        if (is_form === undefined) is_form = false;
        if (failed === undefined) failed = (err) => console.log("Failed to communicate with server: " + err.toString());
        simpleREST(
            url,
            request_conf,
            event_path,
            is_form,
            data,
            (rv) => {
                this.fire_event(rv.tag, rv.data);
            },
            failed
        );
        return true;
    }

    /* Private methods */
    #path_match(pattern, target) {
        let exact = false;
        if (pattern.substring(0, 1) === "/") {
            pattern = pattern.substring(1);
            exact = true;
        }
        const l_pattern = pattern.split('/').reverse();
        const l_target = target.split('/').reverse();
        if (l_pattern.length > l_target.length) return false;
        if (exact && l_pattern.length != l_target.length) return false;
        for (let i = 0; i < l_pattern.length; i++) {
            if (l_pattern[i] != l_target[i]) return false;
        }
        return true;
    }

    #build_path(dom_element) {
        const path = [];
        let current = dom_element.parentElement;
		while (current.parentElement !== null) {
			if (current.id !== '') {
				path.unshift(current.id);
			}
			current = current.parentElement;
		}
		return path.join('/');
    }

    #construct(cname, logic, dom_element, params) {
        this.#dom_paths[cname] = this.#build_path(dom_element);
        this.#components[cname] = new this.#prototypes[logic](this, cname, dom_element, params);
        this.#hydration[cname] = false;
    }

    #is_visible(el) {
        const bbox = el.getBoundingClientRect();
		const h = window.innerHeight;
		if (bbox.y < h) {
			let el_current = el;
			while(el_current.parentElement) {
				if (
                    el_current.style.display == 'none'
                    || el_current.style.visibility == 'collapse'
                    || el_current.style.visibility == 'hidden'
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

    #setup() {
        document.addEventListener('scroll', this.visibility_check.bind(this));
        if (this.persist_inst !== null) {
            this.persist_inst.hash_decode();
            this.persist_inst.sync_shadow();
        }
        const widgets = document.querySelectorAll('.webbus_container');
        for (let i = 0; i < widgets.length; i++) {
            const id = widgets[i].id;
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
                    param_o = eval('(' + params + ')');
                }
                catch(err) {
                    console.log("WebBus ERROR: Cannot parse params for '" + id + "'");
                }
            }
            this.#construct(id, logic, widgets[i], param_o);
        }
        for (const component in this.#components) {
            this.#components[component]._setup();
        }
        this.visibility_check();
    }
}