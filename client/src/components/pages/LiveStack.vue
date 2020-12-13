<template>
  <div class="pa-2">
    <div class="text-h4">Live Stack</div>
    <v-img class="ma-1" :src="livestack.image" max-width="800">
    </v-img>
    <v-divider class="mb-2 mt-2"></v-divider>
    <p v-if="messages && messages.length > 0">{{messages[0].message}}</p>
    <v-divider class="mb-2"></v-divider>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([
      "livestack",
    ]),
    messages() {
      return this.livestack.messages.slice().reverse().slice(0, 10);
    },
  },
};
</script>
