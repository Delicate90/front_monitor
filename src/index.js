import Worker from './worker'
import handler from './handler'

class Monitor {

    static getInstance() {
        if (!Monitor.instance) {
            Monitor.instance = new Monitor()
        }
        return Monitor.instance
    }

    constructor() {
        this.EVENTS = handler.EVENTS;
    }

    use(handlerName = '', config = {}) {
        Worker.subscribe(handlerName, this.generator)
    }

    generator(content = {}) {
        console.log(content.event, content);
    }
}

export default Monitor.getInstance()