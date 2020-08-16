<template>
  <v-app id="app">
    <v-main>
      <h2>Mount</h2>
      <skymap :center="mountPosition"></skymap>
      <p v-if="lastNotificationFormatted">{{lastNotificationFormatted}}</p>
      <v-list>
        <v-list-item>
          <v-btn
            :disabled="this.mount.status === 'Idle' || this.mount.status === 'Tracking'"
            @click="mountAbort"
          >Abort</v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn :disabled="parkButtonText == 'Parking'" @click="togglePark">{{parkButtonText}}</v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn
            @click="toggleTracking"
            :disabled="this.mount.status !== 'Idle' && this.mount.status !== 'Tracking'"
          >{{trackingButtonText}}</v-btn>
        </v-list-item>
      </v-list>
    </v-main>
  </v-app>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";
import skymap from "@/components/SkyMap";

export default {
  components: {
    skymap,
  },
  computed: {
    ...mapGetters([
      "mountPosition",
      "lastNotificationFormatted"]
    ),
    ...mapState([
      'mount',
    ]),
    trackingButtonText() {
      if (this.mount.status == "Idle") {
        return "Start Tracking";
      } else if (this.mount.status == "Tracking") {
        return "Stop Tracking";
      } else if (this.mount.status == "Parked") {
        return "Parked";
      } else {
        return "Moving";
      }
    },
    parkButtonText() {
      if (this.mount.status == "Parked") {
        return "Unpark";
      } else if (this.mount.status == "Parking") {
        return "Parking";
      } else {
        return "Park";
      }
    },
  },
  methods: {
    ...mapActions([
      'mountPark',
      'mountUnpark',
      'mountAbort',
      'mountSetTracking',
    ]),
    togglePark() {
      if (this.mount.status == "Parked") {
        this.mountUnpark();
      } else {
        this.mountPark();
      }
    },
    toggleTracking() {
      if (this.mount.status == "Idle") {
        this.mountSetTracking(true);
      } else if (this.mount.status == "Tracking") {
        this.mountSetTracking(false);
      }
    },
  },
};
</script>
