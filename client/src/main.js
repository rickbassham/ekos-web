import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'
import VueNativeSock from 'vue-native-websocket'

import store from '@/plugins/vuex';

Vue.use(VueNativeSock, 'ws://' + window.location.hostname + ':3000/interface', {
  reconnection: true,
  store: store,
  format: 'json',
});

Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app');
