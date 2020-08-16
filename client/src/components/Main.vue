<template>
  <v-app>
    <v-main>
      <v-img :src="preview.last_image" max-width="640">
      </v-img>
      <h2>{{mount.target}}</h2>

      <p v-if="lastNotificationFormatted">{{lastNotificationFormatted}}</p>

      <ul>
        <li>
          GPS: {{gpsMode}}
          <template v-if="gps.mode >= 2">
            <ul>
              <li>Latitude: {{gps.lat.toFixed(3)}}</li>
              <li>Longitude: {{gps.lon.toFixed(3)}}</li>
              <li v-if="gps.mode >= 3">Altitude: {{gps.alt.toFixed(2)}}m</li>
            </ul>
          </template>
        </li>
        <li>
          Mount: {{mount.status}}
          <ul v-if="mount.ra">
            <li>RA: {{ra}}</li>
            <li>DEC: {{dec}}</li>
          </ul>
        </li>
        <li>
          Guider: {{guide.status}}
          <ul v-if="guide.derms">
            <li>RA RMS: {{guide.rarms.toFixed(3)}}"</li>
            <li>DEC RMS: {{guide.derms.toFixed(3)}}"</li>
          </ul>
        </li>
        <li>
          Focus: {{focus.status}}
          <ul v-if="focus.hfr">
            <li>HFR: {{focus.hfr.toFixed(2)}}"</li>
            <li v-if="focus.pos">Position: {{focus.pos}}</li>
          </ul>
        </li>
        <li>
          Capture: {{capture.status}}
          <ul v-if="capture.seql">
            <li>{{capture.seql}}</li>
          </ul>
        </li>
        <li>
          Alignment: {{align.status}}
          <ul v-if="align.seql">
            <li>{{align.seql}}</li>
          </ul>
        </li>
      </ul>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { hms, dms } from "@/util/coords";

export default {
  props: {},
  computed: {
    ...mapGetters([
      "mountPosition",
      "lastNotificationFormatted"]
    ),
    ...mapState([
      'preview',
      'mount',
      'guide',
      'focus',
      'capture',
      'align',
      'gps',
    ]),
    ra() {
      if (this.mount.ra) return hms(this.mount.ra);
      return "";
    },
    dec() {
      if (this.mount.de) return dms(this.mount.de);
      return "";
    },
    gpsMode() {
      const mode = this.gps.mode;
      return ["Unknown", "No Fix", "2D Fix", "3D Fix"][mode];
    },
  },
};
</script>
