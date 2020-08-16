<template>
  <v-app id="app">
    <v-main>
      <h2>Logs</h2>
      <v-list-item v-for="message in messages" :key="message.uuid">
        <v-list-item-content>
          <v-list-item-title>{{message.message}}</v-list-item-title>
          <v-list-item-subtitle>{{message.ts.toLocaleTimeString("en-US")}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-main>
  </v-app>
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([
      'notifications',
    ]),
    messages() {
      return this.notifications.slice().reverse().slice(0, 10);
    },
  }
};
</script>
