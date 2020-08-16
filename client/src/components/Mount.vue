<template>
  <v-app id="app">
    <v-main>
      <div class="ml-2">
        <div class="text-h4">Mount</div>
        <v-divider class="mb-2"></v-divider>
        <div class="text-h6">{{mount.status}}</div>
        <skymap :center="mountPosition"></skymap>
        <v-divider class="mb-2 mt-2"></v-divider>
        <p v-if="lastNotificationFormatted">{{lastNotificationFormatted}}</p>
        <v-divider class="mb-2"></v-divider>
        <v-list>
          <v-list-item>
            <v-btn block
              :disabled="this.mount.status === 'Idle' || this.mount.status === 'Tracking'"
              @click="mountAbort"
            >Abort</v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn block :disabled="parkButtonText == 'Parking'" @click="togglePark">{{parkButtonText}}</v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn block
              @click="toggleTracking"
              :disabled="this.mount.status !== 'Idle' && this.mount.status !== 'Tracking'"
            >{{trackingButtonText}}</v-btn>
          </v-list-item>
        </v-list>
      </div>
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
