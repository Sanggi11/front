import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'

const emitter = mitt();

import store from './store';

// bootstrap import
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
// bootstrap import
import router from './router'

const app = createApp(App).use(router);


app.provide('eventBus', app); // 이벤트 버스 추가
app.use(store);
app.mount('#app');
app.config.globalProperties.emitter = emitter; // 이벤트 버스 추가
