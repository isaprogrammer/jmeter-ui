import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import JMeterUI from "@/jmeter"

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(JMeterUI);
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    tableSuffix: undefined,
    sampleLabel: undefined,
    kv: {},
    startTime: undefined,
    endTime: undefined,
    before: undefined,
    currentTime: undefined,
    lifeCycle: undefined,
    interval: 3000,
    dida: false
  }
})

new Vue({
  el: '#app', render: h => h(App), store: store
})
