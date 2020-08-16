<template>
  <v-app id="app">
    <v-main>
      <div class="ml-2">
        <div class="text-h4">Align</div>
        <v-divider class="mb-2"></v-divider>
        <div class="text-h6">{{align.status}}</div>
        <div v-if="align.solution">
          <v-row no-gutters>
            <v-col>
              &Delta; RA:
            </v-col>
            <v-col>
              {{align.solution.dRA}}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              &Delta; Dec:
            </v-col>
            <v-col>
              {{align.solution.dDE}}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              RA:
            </v-col>
            <v-col>
              {{align.solution.ra}}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              Dec:
            </v-col>
            <v-col>
              {{align.solution.de}}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              FOV:
            </v-col>
            <v-col>
              {{align.solution.fov}}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              Rotation:
            </v-col>
            <v-col>
              {{align.solution.rot.toFixed(1)}}&deg;
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              ArcSec / Pixel:
            </v-col>
            <v-col>
              {{align.solution.pix.toFixed(2)}}"
            </v-col>
          </v-row>
        </div>
        <v-divider class="mb-2 mt-2"></v-divider>
        <p v-if="lastNotificationFormatted">{{lastNotificationFormatted}}</p>
        <v-divider class="mb-2"></v-divider>
        <v-list>
          <v-list-item>
            <v-btn block @click="toggleAlign">{{solveStopText}}</v-btn>
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
      'align',
    ]),
    solveStopText() {
      if (this.align.status === 'Idle' || this.align.status === 'Failed' || this.align.status === 'Complete' || this.align.status === 'Aborted') {
        return "Solve";
      }

      return "Stop";
    },
  },
  methods: {
    ...mapActions([
      'alignSolve',
      'alignStop',
    ]),
    toggleAlign() {
      if (this.solveStopText === 'Solve') {
        this.alignSolve();
      } else {
        this.alignStop();
      }
    }
  }
};
</script>
