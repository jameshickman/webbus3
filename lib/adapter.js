class ModelAdapter {
    notify_start = "rest_request_start";
    notify_returned = "rest_request_returned";
    bearer = null;

    constructor(web_bus, notify_start, notify_returned) {
        if (notify_start !== undefined) this.notify_start = notify_start;
        if (notify_returned !== undefined) this.notify_returned = notify_returned;
        this.wb = web_bus;
    }

    get_bearer() {
        return "XXXXXXXXXXXXXXXX";
    }

    call(operation) {
        let op = '';
        if(operation.indexOf('/') !== -1) {
            op = operation.split('/')[operation.legth - 1];
        }
        else {
            op = operation;
        }
        op = '_' + op;
        this[op](...arguments);
    }
}