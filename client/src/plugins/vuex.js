import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    },
    preview: {
      last_image: null,
    },
    gps: {
      mode: 0,
    },
    mount: {
      status: "Idle",
      slewRate: null,
      target: null,
      at: null,
      az: null,
      de: null,
      ra: null,
    },
    guide: {
      status: "Idle"
    },
    focus: {
      status: "Idle"
    },
    capture: {
      status: "Idle"
    },
    align: {
      status: "Idle"
    },
    notifications: [],
  },
  mutations: {
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE(state) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE(state, message) {
      state.socket.message = message
      if (message.type == "image_data") {
        state.preview.last_image = message.payload;
      }

      if (message.type == "new_mount_state") {
        state.mount = {
          ...state.mount,
          ...message.payload,
        };
      }

      if (message.type == "new_guide_state") {
        state.guide = {
          ...state.guide,
          ...message.payload,
        };
      }

      if (message.type == "new_focus_state") {
        state.focus = {
          ...state.focus,
          ...message.payload,
        };
      }

      if (message.type == "new_capture_state") {
        state.capture = {
          ...state.capture,
          ...message.payload,
        };
      }

      if (message.type == "new_align_state") {
        state.align = {
          ...state.align,
          ...message.payload,
        };
      }

      if (message.type == "new_gps_state") {
        state.gps = {
          ...state.gps,
          ...message.payload,
        };
      }

      if (message.type == "new_notification") {
        state.notifications.push({ ts: new Date(), ...message.payload });
      }
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
  },
  actions: {
    sendMessage: function (context, message) {
      Vue.prototype.$socket.send(message)
    }
  }
});
