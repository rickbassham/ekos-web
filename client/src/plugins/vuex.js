import Vue from 'vue'
import Vuex from 'vuex'

import {buildDevice} from '@/util/device';

Vue.use(Vuex);

const defaultEkosStates = {
  preview: {
    last_image: null,
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
  camera: null,
  cameras: [],
  filter_wheels: [],
  filters: [],
  notifications: [],
  lastNotification: null,
  devices: {},
};

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    },
    connection: null,
    gps: {
      mode: 0,
      lat: null,
      lon: null,
    },
    profiles: [],
    ...JSON.parse(JSON.stringify(defaultEkosStates)),
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

      console.log(message.type);

      if (message.type == "image_data") {
        state.preview.last_image = message.payload;
      } else if (message.type == "new_mount_state") {
        state.mount = {
          ...state.mount,
          ...message.payload,
        };
      } else if (message.type == "new_connection_state") {
        state.connection = {
          ...state.connection,
          ...message.payload,
        };

        if (message.payload.connected) {
          if (message.payload.online) {
            this.dispatch("sendMessage", { type: "get_states" });
            this.dispatch("sendMessage", { type: "get_cameras" });
            this.dispatch("sendMessage", { type: "get_mounts" });
            this.dispatch("sendMessage", { type: "get_filter_wheels" });
            this.dispatch("sendMessage", { type: "get_domes" });
            this.dispatch("sendMessage", { type: "get_caps" });
            this.dispatch("sendMessage", { type: "get_drivers" });
            this.dispatch("sendMessage", { type: "option_set_high_bandwidth", payload: true });
            this.dispatch("sendMessage", { type: "option_set_image_transfer", payload: true });
            this.dispatch("sendMessage", { type: "option_set_notifications", payload: true });
          } else {
            // Still connected to KStars, but Ekos was closed. Reset states to default.

            Object.keys(defaultEkosStates).forEach(k => {
              state[k] = defaultEkosStates[k];
            });

            this.dispatch("sendMessage", { type: "get_profiles" });
          }
        }
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
      }  else if (message.type == "new_camera_state") {
        state.camera = {
          ...state.camera,
          ...message.payload,
        };
      } else if (message.type == "new_notification") {
        const msg = { ts: new Date(), ...message.payload }
        state.notifications.push(msg);
        state.lastNotification = msg;
      } else if (message.type == "capture_set_settings") {
        state.capture.settings = {
          ...state.capture.settings,
          ...message.payload,
        };

        state.filter_wheels.forEach(fw => {
          if (fw.name === state.capture.settings.fw) {
            state.filters = fw.filters;
          }
        });
      } else if (message.type == "get_cameras") {
        state.cameras = [];
        for (const key in message.payload) {
          state.cameras.push(JSON.parse(JSON.stringify(message.payload[key])));
        }
      } else if (message.type == "get_filter_wheels") {
        state.filter_wheels = [];

        for (const key in message.payload) {
          const item = message.payload[key];

          if (state.capture.settings && state.capture.settings.fw && state.capture.settings.fw === item.name) {
            state.filters = item.filters;
          }

          state.filter_wheels.push(JSON.parse(JSON.stringify(item)));
        }
      } else if (message.type == "get_devices") {
        for (const key in message.payload) {
          const item = JSON.parse(JSON.stringify(message.payload[key]));
          this.dispatch("sendMessage", { type: "device_get", payload: { device: item.name } });
        }
      } else if (message.type == "device_get") {
        const item = JSON.parse(JSON.stringify(message.payload));
        const device = buildDevice(item);

        state.devices[device.name] = device;
      } else if (message.type === "get_profiles") {
        state.profiles = message.payload;
      }else {
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
    alignSolve: ({dispatch}) => {
      dispatch('sendMessage', { type: "align_solve" });
    },
    alignStop: ({dispatch}) => {
      dispatch('sendMessage', { type: "align_stop" });
    },
    focusStop: ({dispatch}) => {
      dispatch('sendMessage', { type: "focus_stop" });
    },
    focusStart: ({dispatch}) => {
      dispatch('sendMessage', { type: "focus_start" });
    },
    focusReset: ({dispatch}) => {
      dispatch('sendMessage', { type: "focus_reset" });
    },
    captureStop: ({dispatch}) => {
      dispatch('sendMessage', { type: "capture_stop" });
    },
    captureStart: ({dispatch}) => {
      dispatch('sendMessage', { type: "capture_start" });
    },
    capturePreview: ({dispatch, state}, settings) => {
      settings = {
        ...state.capture.settings,
        ...settings,
      }

      dispatch('sendMessage', { type: "capture_preview", payload: settings });
    },
    devicePropertySet: ({dispatch}, data) => {
      dispatch('sendMessage', { type: "device_property_set", payload: data });
    },
    startProfile: ({dispatch}, profile) => {
      dispatch('sendMessage', { type: "profile_start", payload: { name: profile }});
    },
  }
});
