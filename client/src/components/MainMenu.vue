<template>
  <div>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Ekos Web</v-toolbar-title>
      <v-spacer></v-spacer>
      <iconify-icon v-if="connected" icon="cloud" height="24"></iconify-icon>
      <iconify-icon v-if="ekosStarted" icon="telescope" height="24" class="ml-2"></iconify-icon>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link exact :to="{name: r.name}" v-for="r in routes" :key="r.name">
          <v-list-item-action>
            <iconify-icon :icon="r.icon" height="24"></iconify-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{r.label || r.name}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { IconifyIcon, routes } from "@/util/routes";

export default {
  components: {
    IconifyIcon,
  },
  computed: {
    ...mapState(["connection"]),
    connected() {
      return this.connection?.connected;
    },
    ekosStarted() {
      return this.connection?.online;
    },
  },
  data: () => ({
    drawer: null,
    routes: routes,
  }),
};
</script>
