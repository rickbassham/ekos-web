<template>
  <div class="pa-2">
    <div class="text-h4">Guide</div>
    <v-img class="ma-1" v-if="guide.image" :src="guide.image.image" :max-width="Math.min(guide.image.width, 800)"></v-img>
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
    <LastNotification />
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
</template>
<script>
import { mapState, mapActions } from "vuex";
import LastNotification from "@/components/common/LastNotification"

export default {
  components: {
    LastNotification,
  },
  computed: {
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
