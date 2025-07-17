<template>
  <div class="audio-player"></div>
</template>

<script lang="ts">
import { Howl } from "howler";
export default {
  components: {},
  props: {
    src: {
      type: String,
      required: true,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    fadeOut: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      instance: null as Howl | null,
    };
  },
  methods: {},
  watch: {},
  computed: {},
  unmounted() {
    if (this.instance === null) return;

    this.instance.on("fade", () => {
      if (this.instance === null) return;
      this.instance.unload();
    });

    this.instance.fade(1, 0, this.fadeOut);
  },
  mounted() {
    const howl = new Howl({
      src: [this.src],
      loop: this.loop || false,
      autoplay: true,
    });
    this.instance = howl;
  },
};
</script>

<style scoped>
#audio-player {
  height: 0;
  width: 0;
}
</style>
