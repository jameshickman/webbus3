function webbus__smart_table_factory(web_bus, name, el, params) {
    let top_index = 0;
    let index_column = 0;
    let el_active_row = null;
    let el_edit_form = null;
    const el_table_body = el.querySelector("table tbody");
    const els_table_headers = el.querySelectorAll("table thead tr th");


    this._setup = function(d) {
        setup();
    };
    this._start = function(d) {};

    // Events
    this.event_set_rows = function(rows) {
        const els_rows = el.querySelectorAll("table tbody tr");
        for (let i = 0; i < els_rows.length; i++) {
            els_rows[i].remove();
        }
        for (let i = 0; i < rows.length; i++) {
            const el_row = document.createElement('TR');
            for (let j = 0; j < els_table_headers.length; j++) {
                const el_cell = document.createElement('TD');
                const d_type = els_table_headers[j].dataset['type'];
                const d_name = els_table_headers[j].dataset['name'];
                switch(d_type) {
                    case 'select':
                        el_cell.innerText = params.fields[d_name].options[rows[i][d_name]];
                        break;
                    case 'bool':
                        if (rows[i][d_name]) {
                            el_cell.innerText = params.fields[d_name].labels.true;
                        }
                        else {
                            el_cell.innerText = params.fields[d_name].labels.false;
                        }
                        break;
                    default:
                        el_cell.innerText = rows[i][d_name];    
                }
                el_row.appendChild(el_cell);
            }
            el_row.appendChild(create_edit_link());
            el_table_body.appendChild(el_row);
        }
    };

    this.event_add_row = function(row) {
        build_new_row(row);
        find_top_index();
    };

    this.event_new_row = function(row) {
        find_top_index();
        top_index += 1;
        disable_enable_action_buttons(true);
        build_new_row(row);
        edit_new_row(true);
    };

    this.event_get_table_values = function() {
        const els_rows = el.querySelectorAll("table tbody tr");
        let values = [];
        for (let i = 0; i < els_rows.length; i++) {
            values.push(decode_row(els_rows[i]));
        }
        return values;
    };

    // Intenal logic
    function getChildElementIndex(node) {
        return Array.prototype.indexOf.call(node.parentNode.children, node);
    }

    function decode_row(el_row) {
        let values = {};
        for (let i = 0; i < els_table_headers.length; i++) {
            const d_type = els_table_headers[i].dataset['type'];
            const d_name = els_table_headers[i].dataset['name'];
            switch (d_type) {
                case 'index':
                case 'int':
                    values[d_name] = parseInt(el_row.children[i].innerText);
                    break;
                case 'float':
                    values[d_name] = parseFloat(el_row.children[i].innerText);
                    break;
                case 'bool':
                    if (el_row.children[i].innerText == params.fields[d_name]['labels']['true']) {
                        values[d_name] = true;
                    }
                    else {
                        values[d_name] = false;
                    }
                    break;
                case 'text':
                    values[d_name] = el_row.children[i].innerText;
                    break;
                case 'select':
                    const options = params.fields[d_name].options;
                    const label = el_row.children[i].innerText;
                    for (let option in options) {
                        if (options[option] == label) {
                            values[d_name] = option;
                            break;
                        }
                    }
                    break;
            }
        }
        return values;
    }

    function build_new_row(d) {
        el_active_row = document.createElement('TR');
        el_table_body.appendChild(el_active_row);
        for (let i = 0; i < els_table_headers.length; i++) {
            const new_cell = document.createElement('TD');
            if (i == index_column) {
                if (d.length >= i && Number.isInteger(d[i])) {
                    new_cell.innerText = parseInt(d[i]);
                }
                else {
                    new_cell.innerText = top_index;
                }
            }
            else if (d !== null && d.length >= els_table_headers.length) {
                new_cell.innerText = d[i];
            }
            el_active_row.appendChild(new_cell);
        }
        el_active_row.appendChild(create_edit_link());
    }

    function build_form_element(idx, values) {
        const d_type = els_table_headers[idx].dataset['type'];
        const d_name = els_table_headers[idx].dataset['name'];
        let el_input = null;
        switch (d_type) {
            case 'int':
                el_input = document.createElement('INPUT');
                el_input.type = "number";
                el_input.step = "1";
                if (values[idx] != '') {
                    el_input.value = parseInt(values[idx]);
                }
                break;
            case 'float':
                el_input = document.createElement('INPUT');
                el_input.type = "number";
                if (values[idx] != '') {
                    el_input.value = parseFloat(values[idx]);
                }
                break;
            case 'bool':
                el_input = document.createElement('INPUT');
                el_input.type = "checkbox";
                if (values[idx] == params['fields'][d_name]['labels']['true']) {
                    el_input.checked = true;
                }
                break;
            case 'select':
                el_input = document.createElement('SELECT');
                for (let key in params['fields'][d_name]['options']) {
                    const el_option = document.createElement('OPTION');
                    el_option.value = key;
                    el_option.innerText = params['fields'][d_name]['options'][key];
                    el_input.appendChild(el_option);
                    if (params['fields'][d_name]['options'][key] == values[idx]) {
                        el_input.value = key;
                    }
                }
                break;
            case 'text':
                // Text line
                el_input = document.createElement('INPUT');
                el_input.type = 'text';
                el_input.value = values[idx];
                break;
            default:
                el_input = document.createElement('SPAN');
                el_input.innerText = values[idx];
        }
        el_input.id = d_name;
        el_input.name = d_name;
        return el_input;
    }

    function save_row() {
        let payload = {};
        const els_cells = el_edit_form.querySelectorAll("td");
        for (let i = 0 ; i < els_table_headers.length; i++) {
            const d_type = els_table_headers[i].dataset['type'];
            const d_name = els_table_headers[i].dataset['name'];
            switch(d_type) {
                case 'int':
                case 'float':
                case 'text':
                    const val = el_edit_form.children[i].querySelector('input').value;
                    el_active_row.children[i].innerText = val;
                    if (d_type == 'int') {
                        payload[d_name] = parseInt(val);
                    }
                    else if (d_type == 'float') {
                        payload[d_name] = parseFloat(val);
                    }
                    else {
                        payload[d_name] = val;
                    }
                    break;
                case 'bool':
                    if (el_edit_form.children[i].querySelector('input').checked) {
                        el_active_row.children[i].innerText = params.fields[d_name].labels['true'];
                        payload[d_name] = true;
                    }
                    else {
                        el_active_row.children[i].innerText = params.fields[d_name].labels['false'];
                        payload[d_name] = false;
                    }
                    break;
                case 'select':
                    const select_control = el_edit_form.children[i].querySelector("select");
                    const key = select_control.options[select_control.selectedIndex].value;
                    const select_val = params.fields[d_name].options[key];
                    el_active_row.children[i].innerText = select_val;
                    payload[d_name] = key;
                    break;
                case 'index':
                    payload[d_name] = parseInt(el_edit_form.children[i].querySelector('span').innerText);
                    break;
            }
        }
        const resp = web_bus.fire_event(params['save_event'], payload);
        // If an index provided by a listener extract and use that
        for (let listener in resp) {
            if (Number.isInteger(resp[listener])) {
                el_active_row.children[index_column].innerText = parseInt(resp[listern]);
                break;
            }
        }
        clear();
    }

    function clear(clear_new) {
        if (el_edit_form !== null) {
            el_edit_form.remove();
        }
        if (clear_new === true) {
            el_active_row.remove();
        }
        else {
            el_active_row.style.display = 'table-row';
        }
        el_edit_form = null;
        el_active_row = null;
    }

    function edit_new_row(is_new) {
        el_active_row.style.display = 'none';
        // Get the row index
        const row_index = getChildElementIndex(el_active_row);
        // Extract the existing values
        const raw_values = [];
        for (let i = 0; i < el_active_row.children.length - 1; i++) {
            raw_values.push(el_active_row.children[i].innerText);
        }
        // Insert form row
        el_edit_form = el_table_body.insertRow(row_index);
        // Build form cells
        for (let i = 0; i < el_active_row.children.length - 1; i++) {
            const el_cell = document.createElement('TD');
            el_cell.appendChild(build_form_element(i, raw_values));
            el_edit_form.appendChild(el_cell);
        }
        // Save and Cancle buttons
        const el_action_container = document.createElement('TD');
        el_action_container.classList.add('_smart-table__actions-container');
        const el_save = document.createElement('BUTTON');
        el_save.addEventListener('click', save_row_clicked);
        el_save.innerText = params.labels.save;
        const el_cancel = document.createElement('BUTTON');
        if (is_new === true) {
            el_cancel.addEventListener('click', cancel_new_clicked);
        }
        else {
            el_cancel.addEventListener('click', cancle_clicked);
        }
        el_cancel.innerText = params.labels.cancel;
        el_action_container.appendChild(el_save);
        el_action_container.appendChild(el_cancel);
        el_edit_form.appendChild(el_action_container);
    }

    function find_top_index() {
        // Find the index column
        const els_rows = el.querySelectorAll("table tbody tr");
        for (let i = 0; i < els_table_headers.length; i++) {
            if (els_table_headers[i].dataset.type == "index") {
                index_column = i;
                break;
            }
        }
        // Find the largest index
        for (let i = 0; i < els_rows.length; i++) {
            const row_index = parseInt(els_rows[i].children[index_column].innerText);
            if (row_index > top_index) top_index = row_index;
        }
    }

    function disable_enable_action_buttons(disable) {
        const els_action_buttons = el_table_body.querySelectorAll('._action_buttons');
        for (let i = 0; i < els_action_buttons.length; i++) {
            els_action_buttons[i].disabled = disable;
        }
    }

    function delete_row(row_idx) {

    }

    // UI Event Handlers
    function edit_clicked(e) {
        disable_enable_action_buttons(true);
        // Make sure only one edit can be active
        if (el_active_row !== null) clear();
        // Get the row element
        el_active_row = e.currentTarget.parentNode.parentNode;
        edit_new_row(false);
    }

    function save_row_clicked(e) {
        save_row();
        disable_enable_action_buttons(false);
    }

    function cancle_clicked() {
        clear(false);
        disable_enable_action_buttons(false);
    }

    function cancel_new_clicked() {
        top_index -= 1;
        clear(true);
        disable_enable_action_buttons(false);
    }

    function delete_clicked(e) {
        const answer = confirm(params.labels.confirm);
        if (answer) {
            const row = e.currentTarget.parentNode.parentNode;
            const idx = parseInt(row.children[index_column].innerText);
            row.remove();
            web_bus.fire_event('event_table_row_deleted', idx);
        }
    }

    function create_edit_link() {
        const el_cell = document.createElement("TD");
        el_cell.classList.add("_smart-table__edit-row");
        const el_edit_button = document.createElement("BUTTON");
        el_edit_button.classList.add('_action_buttons');
        el_edit_button.innerText = params.labels.edit;
        el_edit_button.addEventListener('click', edit_clicked);
        const el_delete_button = document.createElement("BUTTON");
        el_delete_button.classList.add('_action_buttons');
        el_delete_button.innerText = params.labels.delete;
        el_delete_button.addEventListener('click', delete_clicked);
        el_cell.appendChild(el_edit_button);
        el_cell.appendChild(el_delete_button);
        return el_cell;
    }

    // Setup
    function setup() {
        // Add column for the edit button
        const header = el.querySelector("table thead tr");
        const new_header = document.createElement("TH");
        const els_rows = el.querySelectorAll("table tbody tr");
        header.appendChild(new_header);
        for (let i = 0; i < els_rows.length; i++) {
            els_rows[i].appendChild(create_edit_link());
        }
        find_top_index();
    }
}