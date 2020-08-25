/** 全局监控器 **/
class Worker {

    static getInstance() {
        if (!Worker.instance) {
            Worker.instance = new Worker()
        }
        return Worker.instance
    };

    constructor() {
        this.handlers = [];
    }

    subscribe(event = '', func) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(func)
    }


    unSubscribe(event = '') {
        delete this.handlers[event]
    }

    publish(event = '', ...args) {
        const _event = this.handlers[event];
        if (_event && _event.length > 0) {
            for (let i = 0, len = _event.length; i<len;i++) {
                _event[i](...args);
            }
        }
    }
}

export default Worker.getInstance()