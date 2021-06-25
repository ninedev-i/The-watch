import { createApp } from 'vue';
import App from './App.vue';
import ElementUI from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import router from './router';
import './theme/index.css';

const electron:any = require('electron')
const ipc:any = electron.ipcRenderer

// ipc.send('store:set', { key: 'foo.bar', value: '👩' });
//
// ipc.invoke('store:get', 'foo')<Promise>.then((res: string) => {
//     console.log(res);
// });
// ipc.send('store:delete', 'foo')
// ipc.invoke('store:get', 'foo')<Promise>.then((res: string) => {
//     console.log(res)
// });

createApp(App as any)
    .use(router)
    .use(ElementUI)
    .mount('#app');
