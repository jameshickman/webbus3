class WebBusViewRouter extends ComponentFactory{
    #views = [];
    #event_prefix = '';
    #class_shown = 'views__view__visible';
    #class_hidden = 'views__view__hidden';

    _start() {
        this.#build();
    };

    event_goto_view(view) {
        this.persistance_set({'view': view});
        this.#hide();
        this.#goto(view);
    }

    #build() {
        if (this.params.hasOwnProperty('event_prefix')) this.#event_prefix = this.params.event_prefix;
        if (this.params.hasOwnProperty('class_shown')) this.#class_shown = this.params.class_shown;
        if (this.params.hasOwnProperty('class_hidden')) this.#class_hidden = this.params.class_hidden;
        this.persistant_callback((state) => {
            this.#hide();
            this.#goto(this.persistance_get('view'))
        });
        const els_views = this.el.querySelectorAll('DIV');
        for (let i = 0; i < els_views.length; i++) {
            this.#views.push(
                {
                    'element': els_views[i],
                    'name': els_views[i].dataset.name
                }
            );
        }
        this.#hide();
        const current_view = this.persistance_get('view')
        if (current_view === undefined) {
            this.#goto(0);
        }
        else {
            this.#goto(current_view);
        }
    }

    #goto(view) {
        if (isNaN(view)) {
            for (let i = 0; i < this.#views.length; i++) {
                if (this.#views[i].name == view) {
                    view = i;
                    break;
                }
            }
        }
        else {
            this.persistance_set({'view': this.#views[view].name});
        }
        this.#views[view].element.classList.add(this.#class_shown);
        this.#views[view].element.classList.remove(this.#class_hidden);
        this.web_bus.visibility_check();
        this.web_bus.fire_event(this.#event_prefix + 'event_view_shown', this.persistance_get('view'));
    }

    #hide() {
        for (let i = 0; i < this.#views.length; i++) {
            this.#views[i].element.classList.add(this.#class_hidden);
            this.#views[i].element.classList.remove(this.#class_shown);
        }
    }
}