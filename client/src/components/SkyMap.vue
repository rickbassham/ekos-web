<template>
  <div id="celestial-map"></div>
</template>
<style>
  #celestial-map {
    max-width: 800px;
  }
  #celestial-map canvas {
    margin: auto;
    display: block;
    position: relative;
  }
</style>
<script>
import skymap from 'd3-celestial'
const Celestial = skymap.Celestial();

export default {
  props: {
    center: Array,
  },
  mounted() {
    const cfg = this.buildConfig();

    Celestial.display(cfg);
  },
  methods: {
    buildConfig() {
      const cfg = {
        projection: "orthographic",
        transform: "equatorial",
        planets: {show: true, names: true},
        horizon: {show: true, opacity: 1},
        stars: {propername: true},
        follow: "center",
        center: this.center,
        controls: false,
        form: false,
        zoomlevel: 10,
        datapath: "https://ofrohn.github.io/data/",
      };

      return cfg;
    }
  },
  watch: {
    center(nv, ov) {
      let update = false;
      if (!ov || ov.length != 2) {
        update = true;
      } else if (nv[0] != ov[0] || nv[1] != ov[1]) {
        update = true;
      }

      if (update && nv && nv.length == 2) {
        Celestial.stop(true);
        Celestial.rotate({center: [...nv, 0]});
      }
    }
  }
}
</script>
