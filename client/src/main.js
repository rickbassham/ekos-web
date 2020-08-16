import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import VueNativeSock from 'vue-native-websocket'
import store from '@/plugins/vuex';

import App from './App.vue'
import router from '@/plugins/router'

Vue.use(VueNativeSock, 'ws://' + window.location.hostname + ':3000/interface', {
  reconnection: true,
  store: store,
  format: 'json',
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  vuetify,
  store,
  router,
  render: h => h(App),
}).$mount('#app');
