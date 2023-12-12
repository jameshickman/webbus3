class RouterNavigationLinks extends ComponentFactory {
    #event_prefix = '';
    #class_current = 'navigation__link__current';
    _setup() {
        this.#build();
    }

    event_view_shown(view) {
        const els_links = this.el.querySelectorAll('A');
        for (let i = 0; i < els_links.length; i++) {
            if (els_links[i].hash == '#' + view) {
                els_links[i].classList.add(this.#class_current);
            }
            else {
                els_links[i].classList.remove(this.#class_current);
            }
        }
        if (this.hasOwnProperty('extended_event_view_shown')) self.extended_event_view_shown(view);
    }

    #build() {
        const link_clicked = (e) => {
            const name = e.currentTarget.href.split('#')[1];
            this.web_bus.fire_event(this.#event_prefix + 'goto_view', name);
            if (this.hasOwnProperty('extended_link_on_click')) this.extended_link_on_click(e);
            e.preventDefault();
            return false;
        }
        if (this.params.hasOwnProperty('event_prefix')) this.#event_prefix = this.params.event_prefix;
        if (this.params.hasOwnProperty('class_current')) this.#class_current = this.params.class_current;
        const els_links = this.el.querySelectorAll('A');
        for (let i = 0; i < els_links.length; i++) {
            els_links[i].addEventListener('click', link_clicked);
        }
    }
}