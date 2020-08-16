<template>
  <v-app id="app">
    <v-main>
      <div class="ml-2">
        <div class="text-h3">Guide</div>
        <v-divider class="mb-2"></v-divider>
        <div class="text-h6">{{guide.status}}</div>
        <v-row no-gutters>
          <v-col v-if="guide.status === 'Guiding'" align="center">
            RA RMS: {{guide.rarms.toFixed(3)}}
          </v-col>
          <v-col v-if="guide.status === 'Guiding'" align="center">
            Dec RMS: {{guide.derms.toFixed(3)}}
          </v-col>
        </v-row>
        <v-divider class="mb-2 mt-2"></v-divider>
        <p v-if="lastNotificationFormatted">{{lastNotificationFormatted}}</p>
        <v-divider class="mb-2"></v-divider>
        <v-list>
          <v-list-item>
            <v-btn @click="toggleGuiding" block>{{toggleGuidingText}}</v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn @click="guideClear" block>Clear Calibration</v-btn>
          </v-list-item>
        </v-list>
      </div>
    </v-main>
  </v-app>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters([
      'lastNotificationFormatted'
    ]),
    ...mapState([
      'guide',
    ]),
    toggleGuidingText() {
      if (this.guide.status == "Guiding") {
        return "Stop Guiding";
      }

      return "Start Guiding";
    },
  },
  methods: {
    ...mapActions([
      'guideStart',
      'guideStop',
      'guideClear',
    ]),
    toggleGuiding() {
      if (this.guide.status === "Guiding") {
        this.guideStop();
      } else {
        this.guideStart();
      }
    },
  }
};
</script>
