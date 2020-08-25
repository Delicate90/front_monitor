import worker from '../worker';
import {replace, on} from './index'
import logKit from "../kit/logKit";
import commonKit from "../kit/commonKit";

const EVENT_NAME = Symbol();

const xhrHandler = ()=> {
    const originalXHRPrototype = XMLHttpRequest.prototype;
    replace(originalXHRPrototype, 'open', originalOpen => {
        return function(method, url) {
            this.__xhr__ = {
                start: commonKit.getTimestamp(),
                method,
                url,
                headers: {}
            };
            originalOpen.apply(this, arguments)
        }
    })
    replace(originalXHRPrototype, 'setRequestHeader', originalSetRequestHeader => {
        return function(header, value) {
            if (!(header in this.__xhr__.headers)) {
                this.__xhr__.headers[header] = []
            }
            this.__xhr__.headers[header].push(value);
            originalSetRequestHeader.apply(this, [header, value])
        }
    })
    replace(originalXHRPrototype, 'send', originalSend => {
        return function(...args) {
            console.log('return', this);
            on(this, 'loadend', function(e){
                console.log('loadend', e);
                const {__xhr__ = {}, timeout = 0, status, statusText} = this;
                const {url, method, headers, start} = __xhr__;
                worker.publish(EVENT_NAME, {event: 'xhr', url, method, headers, status, timing: e.timeStamp, statusText})
            })
            on(this, 'timeout', function(e){
                console.log('timeout', e);
                const {__xhr__ = {}, timeout = 0} = this;
                const {url, method, headers, start} = __xhr__;
                worker.publish(EVENT_NAME, {event: 'xhr', url, method, headers, status: 'Timeout', timing: e.timeStamp, statusText: `timeout of ${timeout}ms exceeded`})
            })
            on(this, 'error', function(e){
                console.error('e', e);
            })
            originalSend.apply(this, args)
        }
    })
    logKit.loaded('xhr');
};

const fetchHandler = ()=> {
    const _fetch = fetch;
    Object.defineProperty(window, 'fetch', {
        configurable: true,
        enumerable: true,
        get() {
            return (url, options) => {
                return _fetch(url, options).then(res=>{
                    if (res.status >= 400) {
                        worker.publish(EVENT_NAME, {event: 'fetch', url, options, status: res.status, statusText: res.statusText})
                    }
                    return res
                }).catch(e=>{
                    worker.publish(EVENT_NAME, {event: 'fetch', url, options, status: 'Network Error', statusText: e})
                    throw e
                })
            }
        }
    })
    logKit.loaded('fetch');
};

const load = (config = {})=> {
    xhrHandler();
    fetchHandler();
    return EVENT_NAME
};

export default load()
