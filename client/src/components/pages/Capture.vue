<template>
  <div class="pa-2">
    <div class="text-h4">Capture</div>
    <v-img class="ma-1" :src="preview.last_image" max-width="640"></v-img>
    <v-divider class="mb-2"></v-divider>
    <div class="text-h6">{{capture.status}}</div>
    <div v-if="capture.expr">
      <v-row no-gutters>
        <v-col>
          Exposure:
        </v-col>
        <v-col>
          {{capture.expv.toFixed(2)}} of {{capture.expr}}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          Overall Time Remaining:
        </v-col>
        <v-col>
          {{capture.ovt}}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          Job Time Remaining:
        </v-col>
        <v-col>
          {{capture.seqt}}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          Job Label:
        </v-col>
        <v-col>
          {{capture.seql}}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          Job Exposures:
        </v-col>
        <v-col>
          {{capture.seqv}} of {{capture.seqr}}
        </v-col>
      </v-row>
    </div>
    <LastNotification />
    <v-divider class="mb-2"></v-divider>
    <v-form class="ma-1">
      <v-select v-model="selectedCamera" :items="cameras" label="Camera" item-text="name" item-value="name" />
      <v-select v-model="selectedFilterWheel" :items="filter_wheels" label="Filter Wheel" item-text="name" item-value="name" />
      <v-text-field type="number" label="Exposure" v-model="exp" suffix="sec" min="0"/>
      <v-select v-model="selectedFilter" :items="filters" label="Filter" />
    </v-form>
    <v-divider class="mb-2"></v-divider>
    <v-list>
      <v-list-item>
        <v-btn block @click="onPreviewClick" :disabled="this.capture.status !== 'Idle'">Preview</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn block @click="toggleCapture">{{startStopText}}</v-btn>
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
  data() {
    return {
      selectedCamera: null,
      selectedFilterWheel: null,
      selectedFilter: null,
      exp: null,
    };
  },
  computed: {
    ...mapState([
      'capture',
      'preview',
      'cameras',
      'filter_wheels',
      'camera',
      'filters',
    ]),
    startStopText() {
      if (this.capture.status === 'Idle' || this.capture.status === 'Complete') {
        return "Start";
      }

      return "Stop";
    },
  },
  watch: {
    capture(val) {
      if (val && val.settings) {
        if (!this.exp) {
          this.exp = val.settings.exp;
        }
        if (!this.selectedCamera) {
          this.selectedCamera = val.settings.camera;
        }
        if (!this.selectedFilterWheel) {
          this.selectedFilterWheel = val.settings.fw;
        }
        if (!this.selectedFilter) {
          this.selectedFilter = val.settings.filter;
        }
      }
    }
  },
  mounted() {
    if (this.capture && this.capture.settings) {
      this.selectedCamera = this.capture.settings.camera;
      this.selectedFilterWheel = this.capture.settings.fw;
      this.selectedFilter = this.capture.settings.filter;
      this.exp = this.capture.settings.exp;
    }
  },
  methods: {
    ...mapActions([
      'captureStop',
      'captureStart',
      'capturePreview',
    ]),
    toggleCapture() {
      if (this.startStopText === "Start") {
        this.captureStart();
      } else {
        this.captureStop();
      }
    },
    onPreviewClick() {
      this.capturePreview({
        exp: parseInt(this.exp),
        camera: this.selectedCamera,
        fw: this.selectedFilterWheel,
        filter: this.selectedFilter,
      });
    },
  },
};
</script>
