<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <iconify-icon icon="home" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Ekos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <iconify-icon icon="camera" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Capture</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <iconify-icon icon="telescope" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mount</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <iconify-icon icon="target" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Align</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <iconify-icon icon="compass" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Guide</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Ekos Web</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col>
            <v-card class="mx-auto" max-width="800">
              <v-img class="white--text align-end" :src="image">
                <v-card-title>{{mount.target}}</v-card-title>
              </v-img>

              <template v-if="last_notification">
                <v-card-subtitle>{{last_notification}}</v-card-subtitle>
              </template>

              <v-card-text class="text--primary">
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
                    <template v-if="mount.ra">
                      <ul>
                        <li>RA: {{ra}}</li>
                        <li>DEC: {{dec}}</li>
                      </ul>
                    </template>
                  </li>
                  <li>
                    Guider: {{guide.status}}
                    <template v-if="guide.derms">
                      <ul>
                        <li>RA RMS: {{guide.rarms.toFixed(3)}}"</li>
                        <li>DEC RMS: {{guide.derms.toFixed(3)}}"</li>
                      </ul>
                    </template>
                  </li>
                  <li>
                    Focus: {{focus.status}}
                    <template v-if="focus.hfr">
                      <ul>
                        <li>HFR: {{focus.hfr.toFixed(2)}}"</li>
                        <li v-if="focus.pos">Position: {{focus.pos}}</li>
                      </ul>
                    </template>
                  </li>
                  <li>
                    Capture: {{capture.status}}
                    <template v-if="capture.seql">
                      <ul>
                        <li>{{capture.seql}}</li>
                      </ul>
                    </template>
                  </li>
                  <li>
                    Alignment: {{align.status}}
                    <template v-if="align.seql">
                      <ul>
                        <li>{{align.seql}}</li>
                      </ul>
                    </template>
                  </li>
                </ul>
              </v-card-text>
              <v-card-actions></v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import IconifyIcon from "@iconify/vue";
import telescope from "@iconify/icons-mdi/telescope";
import target from "@iconify/icons-mdi/target";
import home from "@iconify/icons-mdi/home";
import camera from "@iconify/icons-mdi/camera";
import compass from "@iconify/icons-mdi/compass";

IconifyIcon.addIcon("telescope", telescope);
IconifyIcon.addIcon("target", target);
IconifyIcon.addIcon("home", home);
IconifyIcon.addIcon("camera", camera);
IconifyIcon.addIcon("compass", compass);

const hms = (dec) => {
  const H = dec / 15;

  const h = Math.floor(H);
  const m = Math.floor(60 * (Math.abs(H) - h));
  const s = 60 * (60 * (Math.abs(H) - h) - m);

  return (
    h.toString() +
    "h " +
    m.toString() +
    "m " +
    s.toFixed(2) +
    "s (" +
    H.toFixed(3) +
    "h)"
  );
};

const dms = (dec) => {
  const negative = dec < 0.0 ? "-" : "";

  const d = Math.floor(Math.abs(dec));
  const m = Math.floor(60 * (Math.abs(dec) - d));
  const s = Math.floor(60 * (60 * (Math.abs(dec) - d) - m));

  return (
    negative +
    d.toString() +
    "° " +
    m.toString() +
    "' " +
    s.toFixed(2) +
    '" (' +
    dec.toFixed(3) +
    "°)"
  );
};

export default {
  components: {
    IconifyIcon,
  },
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
  }),
  computed: {
    image() {
      return this.$store.state.preview.last_image;
    },
    mount() {
      return this.$store.state.mount;
    },
    guide() {
      return this.$store.state.guide;
    },
    focus() {
      return this.$store.state.focus;
    },
    capture() {
      return this.$store.state.capture;
    },
    align() {
      return this.$store.state.align;
    },
    ra() {
      if (this.mount.ra) return hms(this.mount.ra);
      return "";
    },
    dec() {
      if (this.mount.de) return dms(this.mount.de);
      return "";
    },
    gps() {
      return this.$store.state.gps;
    },
    gpsMode() {
      const mode = this.$store.state.gps.mode;
      return ["Unknown", "No Fix", "2D Fix", "3D Fix"][mode];
    },
    last_notification() {
      if (this.$store.state.notifications) {
        const data = this.$store.state.notifications[
          this.$store.state.notifications.length - 1
        ];
        if (data)
          return data.message + " " + data.ts.toLocaleTimeString("en-US");
      }

      return "";
    },
  },
};
</script>
