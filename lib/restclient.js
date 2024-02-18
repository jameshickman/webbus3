function simpleREST(url, request_conf, tag, is_form, data, cb_success, cb_failure) {
    async function do_request() {
        const r = await fetch(url, request_conf);
        const data = await r.json();
        return [r, data]
    }

    if (!request_conf.hasOwnProperty('method')) {
        if (is_form) {
            request_conf['method'] = 'POST';
        }
        else {
            request_conf['method'] = 'GET';
        }
    }
    if (!request_conf.hasOwnProperty('mode')) request_conf['mode'] = 'cors';
    if (!request_conf.hasOwnProperty('cache')) request_conf['cache'] = 'no-cache';
    if (!request_conf.hasOwnProperty('credentials')) request_conf['credentials'] = 'same-origin';
    if (!request_conf.hasOwnProperty('headers')) request_conf['headers'] = {};
    if (!is_form) {
        request_conf.headers['Content-Type'] = 'application/json';
    }
    if (!request_conf.hasOwnProperty('redirect')) request_conf['redirect'] = 'follow';
    if (!request_conf.hasOwnProperty('referrerPolicy')) request_conf['referrerPolicy'] = 'no-referrer';

    if (is_form) {
        const fd = new FormData();
        for (let k in data) {
            fd.append(k, data[k]);
        }
        request_conf['body'] = fd;
    }
    else if (data !== undefined && data !== false && data !== null){
        request_conf['body'] = JSON.stringify(data);
    }

    do_request().then(
        (r) => {
            cb_success(
                {
                    'data': r[1],
                    'response': r[0],
                    'code': r[0].status,
                    'tag': tag
                }
            );
        }
    ).catch(
        (err) => {
            cb_failure(err);
        }
    )
}