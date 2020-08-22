<template>
  <div>
    <v-form>
      <fieldset class="pa-2 mb-4">
        <legend>{{property.label}} - {{propState(property.state)}}</legend>
        <v-list v-if="property.switches">
          <v-list-item v-for="s in property.switches" :key="s.name">
            <v-btn :outlined="isOutlined(s.state)">{{s.label}}</v-btn>
          </v-list-item>
        </v-list>
        <v-list v-if="property.texts">
            <v-text-field
              v-for="t in property.texts"
              :key="t.name"
              :label="t.label"
              :value="t.value"
              :readonly="isReadOnly"
            />
            <v-btn v-if="!isReadOnly">
              Set
            </v-btn>
        </v-list>
        <v-list v-if="property.numbers">
            <v-text-field
              v-for="n in property.numbers"
              :key="n.name"
              :label="n.label"
              :value="n.value"
              :readonly="isReadOnly"
              type="number"
              :step="n.step || undefined"
              :min="n.min"
              :max="n.mix"
            />
            <v-btn v-if="!isReadOnly">
              Set
            </v-btn>
        </v-list>
      </fieldset>
    </v-form>
  </div>
</template>
<script>
import { PERM, PROP_STATE, SWITCH_STATE } from "@/util/device";

export default {
  props: {
    device: String,
    property: Object,
  },
  computed: {
    isReadWrite() {
      return this.property.perm === PERM.IP_RW;
    },
    isReadOnly() {
      return this.property.perm === PERM.IP_RO;
    },
    isWriteOnly() {
      return this.property.perm === PERM.IP_WO;
    },
  },
  methods: {
    isOutlined(ss) {
      if (ss === SWITCH_STATE.ISS_OFF) {
        return false;
      }

      return true;
    },
    propState(s) {
      switch (s) {
        case PROP_STATE.IPS_IDLE:
          return "Idle";
        case PROP_STATE.IPS_OK:
          return "OK";
        case PROP_STATE.IPS_BUSY:
          return "Busy";
        case PROP_STATE.IPS_ALERT:
          return "Alert";
      }

      return "Unknown";
    },
  },
};
</script>
