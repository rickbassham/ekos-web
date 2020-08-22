<template>
  <v-app id="app">
    <MainMenu></MainMenu>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import MainMenu from "./components/MainMenu";

export default {
  name: 'app',
  components: {
    MainMenu,
  },
};
</script>
