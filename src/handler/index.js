import HTTP from './httpHandler'
import ERROR from './errorHandler'

class Handler {
    static getInstance() {
        if (!Handler.instance) {
            Handler.instance = new Handler();
        }
        return Handler.instance
    }

    constructor() {
        this.EVENTS = {HTTP, ERROR}
    }
}

export default Handler.getInstance()

export function replace(source = {}, name = '', replacement = ()=>{}) {
    const original = source[name];
    if (original) {
        const wrapped = replacement(original)
        if (typeof wrapped === 'function') source[name] = wrapped
    }
}

export function on(target = {}, eventName = '', handler = ()=>{}, options = false) {
    target.addEventListener(eventName, handler, options)
}