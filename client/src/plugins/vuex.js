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
      lat: null,
      lon: null,
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
    lastNotification: null,
  },
  getters: {
    mountPosition: state => {
      if (state.mount.ra !== null && state.mount.de !== null) {
        return [
          parseFloat(state.mount.ra.toFixed(3)),
          parseFloat(state.mount.de.toFixed(3)),
        ];
      }

      return null;
    },
    gpsLocation: state => {
      if (state.gps.lat !== null && state.gps.lon !== null) {
        return [
          parseFloat(state.gps.lat.toFixed(3)),
          parseFloat(state.gps.lon.toFixed(3)),
        ];
      }
      return null;
    },
    lastNotificationFormatted: state => {
      if (state.lastNotification) {
        return state.lastNotification.message + " " + state.lastNotification.ts.toLocaleTimeString("en-US");
      }

      return null;
    }
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
      } else if (message.type == "new_mount_state") {
        state.mount = {
          ...state.mount,
          ...message.payload,
        };
      } else if (message.type == "new_guide_state") {
        state.guide = {
          ...state.guide,
          ...message.payload,
        };
      } else if (message.type == "new_focus_state") {
        state.focus = {
          ...state.focus,
          ...message.payload,
        };
      } else if (message.type == "new_capture_state") {
        state.capture = {
          ...state.capture,
          ...message.payload,
        };
      } else if (message.type == "new_align_state") {
        state.align = {
          ...state.align,
          ...message.payload,
        };
      } else if (message.type == "new_gps_state") {
        state.gps = {
          ...state.gps,
          ...message.payload,
        };
      } else if (message.type == "new_notification") {
        const msg = { ts: new Date(), ...message.payload }
        state.notifications.push(msg);
        state.lastNotification = msg;
      } else {
        console.warn({...message});
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
    sendMessage: (context, message) => {
      Vue.prototype.$socket.send(JSON.stringify(message))
    },
    mountPark: ({ dispatch }) => {
      dispatch('sendMessage', { type: "mount_park" });
    },
    mountUnpark: ({ dispatch }) => {
      dispatch('sendMessage', { type: "mount_unpark" });
    },
    mountAbort: ({ dispatch }) => {
      dispatch('sendMessage', { type: "mount_abort" });
    },
    mountSetTracking: ({dispatch}, enabled) => {
      dispatch('sendMessage', {
        type: "mount_set_tracking",
        payload: { enabled },
      });
    },
    guideStart: ({dispatch}) => {
      dispatch('sendMessage', { type: "guide_start" });
    },
    guideStop: ({dispatch}) => {
      dispatch('sendMessage', { type: "guide_stop" });
    },
    guideClear: ({dispatch}) => {
      dispatch('sendMessage', { type: "guide_clear" });
    },
  }
});
