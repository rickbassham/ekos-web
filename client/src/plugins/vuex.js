import Vue from 'vue'
import Vuex from 'vuex'

import { buildDevice } from '@/util/device';

import {
  IMAGE_DATA,
  NEW_MOUNT_STATE,
  NEW_CONNECTION_STATE,
  NEW_GUIDE_STATE,
  NEW_FOCUS_STATE,
  NEW_CAPTURE_STATE,
  NEW_ALIGN_STATE,
  NEW_GPS_STATE,
  NEW_CAMERA_STATE,
  NEW_NOTIFICATION,
  CAPTURE_SET_SETTINGS,
  GET_CAMERAS,
  GET_FILTER_WHEELS,
  GET_DEVICES,
  DEVICE_GET,
  GET_PROFILES,
  MOUNT_PARK,
  MOUNT_UNPARK,
  MOUNT_ABORT,
  MOUNT_SET_TRACKING,
  GUIDE_START,
  GUIDE_STOP,
  GUIDE_CLEAR,
  ALIGN_SOLVE,
  ALIGN_STOP,
  FOCUS_STOP,
  FOCUS_START,
  FOCUS_RESET,
  CAPTURE_STOP,
  CAPTURE_START,
  CAPTURE_PREVIEW,
  DEVICE_PROPERTY_SET,
  START_PROFILE,
  SET_CLIENT_STATE,
  GET_STATES,
  GET_MOUNTS,
  GET_DOMES,
  GET_CAPS,
  GET_DRIVERS,
  OPTION_SET_HIGH_BANDWIDTH,
  OPTION_SET_IMAGE_TRANSFER,
  OPTION_SET_NOTIFICATIONS,
} from '../util/messageTypes';

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
      // turn this into a dumb object
      message = JSON.parse(JSON.stringify(message));
      state.socket.message = message

      this.commit(message.type, message);
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
    [IMAGE_DATA](state, message) {
      state.preview.last_image = message.payload;
    },
    [NEW_MOUNT_STATE](state, message) {
      state.mount = {
        ...state.mount,
        ...message.payload,
      };
    },
    [NEW_CONNECTION_STATE](state, message) {
      state.connection = {
        ...state.connection,
        ...message.payload,
      };

      if (message.payload.connected) {
        if (message.payload.online) {
          this.dispatch("sendMessage", { type: SET_CLIENT_STATE, payload: { state: true } });
          this.dispatch("sendMessage", { type: GET_STATES });
          this.dispatch("sendMessage", { type: GET_CAMERAS });
          this.dispatch("sendMessage", { type: GET_MOUNTS });
          this.dispatch("sendMessage", { type: GET_FILTER_WHEELS });
          this.dispatch("sendMessage", { type: GET_DOMES });
          this.dispatch("sendMessage", { type: GET_CAPS });
          this.dispatch("sendMessage", { type: GET_DRIVERS });
          this.dispatch("sendMessage", { type: OPTION_SET_HIGH_BANDWIDTH, payload: true });
          this.dispatch("sendMessage", { type: OPTION_SET_IMAGE_TRANSFER, payload: true });
          this.dispatch("sendMessage", { type: OPTION_SET_NOTIFICATIONS, payload: true });
        } else {
          // Still connected to KStars, but Ekos was closed. Reset states to default.

          Object.keys(defaultEkosStates).forEach(k => {
            state[k] = defaultEkosStates[k];
          });

          this.dispatch("sendMessage", { type: GET_PROFILES });
        }
      }
    },
    [NEW_GUIDE_STATE](state, message) {
      state.guide = {
        ...state.guide,
        ...message.payload,
      };
    },
    [NEW_FOCUS_STATE](state, message) {
      state.focus = {
        ...state.focus,
        ...message.payload,
      };
    },
    [NEW_CAPTURE_STATE](state, message) {
      state.capture = {
        ...state.capture,
        ...message.payload,
      };
    },
    [NEW_ALIGN_STATE](state, message) {
      state.align = {
        ...state.align,
        ...message.payload,
      };
    },
    [NEW_GPS_STATE](state, message) {
      state.gps = {
        ...state.gps,
        ...message.payload,
      };
    },
    [NEW_CAMERA_STATE](state, message) {
      state.camera = {
        ...state.camera,
        ...message.payload,
      };
    },
    [NEW_NOTIFICATION](state, message) {
      const msg = { ts: new Date(), ...message.payload }
      state.notifications.push(msg);
      state.lastNotification = msg;
    },
    [CAPTURE_SET_SETTINGS](state, message) {
      state.capture.settings = {
        ...state.capture.settings,
        ...message.payload,
      };

      state.filter_wheels.forEach(fw => {
        if (fw.name === state.capture.settings.fw) {
          state.filters = fw.filters;
        }
      });
    },
    [GET_CAMERAS](state, message) {
      state.cameras = [];
      for (const key in message.payload) {
        state.cameras.push(JSON.parse(JSON.stringify(message.payload[key])));
      }
    },
    [GET_FILTER_WHEELS](state, message) {
      state.filter_wheels = [];

      for (const key in message.payload) {
        const item = message.payload[key];

        if (state.capture.settings && state.capture.settings.fw && state.capture.settings.fw === item.name) {
          state.filters = item.filters;
        }

        state.filter_wheels.push(JSON.parse(JSON.stringify(item)));
      }
    },
    [GET_DEVICES](state, message) {
      for (const key in message.payload) {
        const item = JSON.parse(JSON.stringify(message.payload[key]));
        this.dispatch("sendMessage", { type: DEVICE_GET, payload: { device: item.name } });
      }
    },
    [DEVICE_GET](state, message) {
      const device = buildDevice(message.payload);
      state.devices[device.name] = device;
    },
    [GET_PROFILES](state, message) {
      state.profiles = message.payload;
    },
  },
  actions: {
    sendMessage: (context, message) => {
      Vue.prototype.$socket.send(JSON.stringify(message))
    },
    mountPark: ({ dispatch }) => {
      dispatch('sendMessage', { type: MOUNT_PARK });
    },
    mountUnpark: ({ dispatch }) => {
      dispatch('sendMessage', { type: MOUNT_UNPARK });
    },
    mountAbort: ({ dispatch }) => {
      dispatch('sendMessage', { type: MOUNT_ABORT });
    },
    mountSetTracking: ({ dispatch }, enabled) => {
      dispatch('sendMessage', {
        type: MOUNT_SET_TRACKING,
        payload: { enabled },
      });
    },
    guideStart: ({ dispatch }) => {
      dispatch('sendMessage', { type: GUIDE_START });
    },
    guideStop: ({ dispatch }) => {
      dispatch('sendMessage', { type: GUIDE_STOP });
    },
    guideClear: ({ dispatch }) => {
      dispatch('sendMessage', { type: GUIDE_CLEAR });
    },
    alignSolve: ({ dispatch }) => {
      dispatch('sendMessage', { type: ALIGN_SOLVE });
    },
    alignStop: ({ dispatch }) => {
      dispatch('sendMessage', { type: ALIGN_STOP });
    },
    focusStop: ({ dispatch }) => {
      dispatch('sendMessage', { type: FOCUS_STOP });
    },
    focusStart: ({ dispatch }) => {
      dispatch('sendMessage', { type: FOCUS_START });
    },
    focusReset: ({ dispatch }) => {
      dispatch('sendMessage', { type: FOCUS_RESET });
    },
    captureStop: ({ dispatch }) => {
      dispatch('sendMessage', { type: CAPTURE_STOP });
    },
    captureStart: ({ dispatch }) => {
      dispatch('sendMessage', { type: CAPTURE_START });
    },
    capturePreview: ({ dispatch, state }, settings) => {
      settings = {
        ...state.capture.settings,
        ...settings,
      }

      dispatch('sendMessage', { type: CAPTURE_PREVIEW, payload: settings });
    },
    devicePropertySet: ({ dispatch }, data) => {
      dispatch('sendMessage', { type: DEVICE_PROPERTY_SET, payload: data });
    },
    startProfile: ({ dispatch }, profile) => {
      dispatch('sendMessage', { type: START_PROFILE, payload: { name: profile } });
    },
  }
});
