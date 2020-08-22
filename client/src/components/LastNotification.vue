<template>
  <div>
    <v-divider v-if="lastNotificationFormatted" class="mb-2 mt-2"></v-divider>
    <p v-if="lastNotificationFormatted">{{lastNotificationFormatted}}</p>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters([
      'lastNotificationFormatted'
    ]),
  }
};
</script>
