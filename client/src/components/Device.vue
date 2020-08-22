<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel v-for="(group, name) in device.groups" :key="name">
        <v-expansion-panel-header>{{name}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <DeviceProperty
            v-for="property in group.properties"
            :key="property.name"
            :property="property"
            :device="device.name"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import DeviceProperty from "@/components/DeviceProperty.vue";

export default {
  props: {
    device: Object,
  },
  components: {
    DeviceProperty,
  },
  computed: {},
  methods: {},
};
</script>
