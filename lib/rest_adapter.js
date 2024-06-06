import ModelAdapter from "./adapter.js";

class RESTadapter extends ModelAdapter {
    get_bearer() {
        const b = localStorage.getItem("bearer");
        if (b) {
            this.bearer = b;
        }
        return b;
    }

    rest_call(url, request_conf, cb_success, cb_failure, data) {
        async function do_request() {
            const r = await fetch(url, request_conf);
            const data = await r.json();
            return [r, data]
        }

        if (request_conf.hasOwnProperty('method')) {
            if (request_conf.method.toLowerCase() === 'json' && data !== undefined) {
                if (!request_conf.hasOwnProperty('headers')) request_conf.headers = {};
                request_conf.headers['Content-Type'] = 'application/json';
            }
        }
        else {
            request_conf['method'] = 'GET';
        }
        if (!request_conf.hasOwnProperty('mode')) request_conf['mode'] = 'cors';
        if (!request_conf.hasOwnProperty('cache')) request_conf['cache'] = 'no-cache';
        if (!request_conf.hasOwnProperty('credentials')) request_conf['credentials'] = 'same-origin';
        if (!request_conf.hasOwnProperty('headers')) request_conf['headers'] = {};
        if (!request_conf.hasOwnProperty('redirect')) request_conf['redirect'] = 'follow';
        if (!request_conf.hasOwnProperty('referrerPolicy')) request_conf['referrerPolicy'] = 'no-referrer';

        if (request_conf.method.toLowerCase() === 'post' && data !== undefined) {
            const fd = new FormData();
            for (let k in data) {
                fd.append(k, data[k]);
            }
            request_conf['body'] = fd;
        }
        else if (request_conf.method.toLowerCase() === 'json' && data !== undefined) {
            request_conf['body'] = JSON.stringify(data);
        }

        do_request().then(
            (r) => {
                cb_success(
                    {
                        'data': r[1],
                        'response': r[0],
                        'code': r[0].status
                    }
                );
            }
        ).catch(
            (err) => {
                cb_failure(err);
            }
        )
    }
}

export default RESTadapter;