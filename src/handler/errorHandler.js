import worker from '../worker'
import logKit from "../kit/logKit";

const EVENT_NAME = Symbol();

const listenErrorHandler = ()=> {
    window.addEventListener('error', function(e){
        console.log('error',e);
    })
    window.addEventListener('unhandledrejection', function(e){
        console.log('unhandledrejection',e);
    })
    logKit.loaded('error')
};

const load = ()=> {
    listenErrorHandler();
    return EVENT_NAME
};

export default load()