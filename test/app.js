import monitor from '../src/index'

import Axios from 'axios'

monitor.use(monitor.EVENTS.HTTP);

Axios.defaults.timeout = 20000;

const test = ()=> {
    Axios('http://192.168.9.254:8008/test/error', {method: 'post', headers: {Authorization: '123'}}).then(res=>{
        console.log('test res', res);
    }).catch(e=>{
        console.log('test e', e);
    })
};

test();