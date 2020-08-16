<template>
  <v-app id="app">
    <Menu></Menu>
    <router-view></router-view>
  </v-app>
</template>

<script>
import menu from "./components/Menu";

export default {
  name: 'app',
  components: {
    menu,
  },
};
</script>
