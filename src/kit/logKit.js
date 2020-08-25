export default class logKit {
    static loaded(handlerName = '') {
        console.debug('monitor-handler ['+handlerName+'] %cloaded', 'color: green;')
    }
}