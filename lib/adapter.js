class ModelAdapter {
    bearer = null;
    constructor(web_bus) {
        this.wb = web_bus;
    }

    get_bearer() {
        const b = localStorage.getItem("bearer");
        if (b) {
            this.bearer = b;
        }
    }

    call(operation) {
        let op = '';
        if(operation.indexOf('/') !== -1) {
            op = operation.split('/')[operation.legth - 1];
        }
        else {
            op = operation;
        }
        if(!this.operations.hasOwnProperty(op)) {
            throw new Error("Operation not defined!")
        }
        else {
            this.operations[op](...arguments);
        }
    }

    operations = {};
}