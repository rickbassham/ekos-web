<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link :to="{name: 'Main'}">
          <v-list-item-action>
            <iconify-icon icon="home" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Ekos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'Capture'}">
          <v-list-item-action>
            <iconify-icon icon="camera" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Capture</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'Mount'}">
          <v-list-item-action>
            <iconify-icon icon="telescope" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mount</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'Align'}">
          <v-list-item-action>
            <iconify-icon icon="target" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Align</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'Guide'}">
          <v-list-item-action>
            <iconify-icon icon="compass" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Guide</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'Focus'}">
          <v-list-item-action>
            <iconify-icon icon="magnify" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Focus</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'Logs'}">
          <v-list-item-action>
            <iconify-icon icon="comment" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logs</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Ekos Web</v-toolbar-title>
      <v-spacer></v-spacer>
      <iconify-icon v-if="connected" icon="cloud" height="24"></iconify-icon>
      <iconify-icon v-if="ekosStarted" icon="telescope" height="24" class="ml-2"></iconify-icon>
    </v-app-bar>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState } from "vuex";
import IconifyIcon from "@iconify/vue";
import telescope from "@iconify/icons-mdi/telescope";
import target from "@iconify/icons-mdi/target";
import home from "@iconify/icons-mdi/home";
import camera from "@iconify/icons-mdi/camera";
import compass from "@iconify/icons-mdi/compass";
import magnify from "@iconify/icons-mdi/magnify";
import comment from "@iconify/icons-mdi/comment";
import cloud from "@iconify/icons-mdi/cloud";

IconifyIcon.addIcon("telescope", telescope);
IconifyIcon.addIcon("target", target);
IconifyIcon.addIcon("home", home);
IconifyIcon.addIcon("camera", camera);
IconifyIcon.addIcon("compass", compass);
IconifyIcon.addIcon("magnify", magnify);
IconifyIcon.addIcon("comment", comment);
IconifyIcon.addIcon("cloud", cloud);

export default Vue.component('Menu', {
  components: {
    IconifyIcon,
  },
  computed: {
    ...mapState([
      'connection',
    ]),
    connected() {
      return this.connection?.connected;
    },
    ekosStarted() {
      return this.connection?.online;
    },
  },
  data: () => ({
    drawer: null,
  }),
});
</script>