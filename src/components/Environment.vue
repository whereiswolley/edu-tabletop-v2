<template>
  <div id="environment" :style="lighting"></div>
</template>

<script lang="ts">
import gsap from "gsap";
export default {
  components: {},
  props: {
    focusPercentPosX: {
      type: Number,
      default: 50,
    },
  },
  data() {
    return {
      position: { x: 50, y: 50 },
    };
  },
  methods: {},
  watch: {},
  computed: {
    lighting() {
      const dawn = [
        `radial-gradient(ellipse at ${this.focusPercentPosX}% -25%, rgba(255, 183, 107, 0.6) 0%, transparent 40%)`,
        "radial-gradient(ellipse at 50% 50%, transparent, rgba(135, 206, 235, 0.3))",
        "linear-gradient(120deg, rgba(255, 94, 77, 0.2) 0%, transparent 50%, rgba(255, 206, 84, 0.2) 100%)",
        `radial-gradient(ellipse at ${this.position.x}% 0%, transparent -25%, rgba(255, 165, 0, 0.8) 150%)`,
      ];
      const cyberpunk = [
        `radial-gradient(ellipse at ${this.focusPercentPosX}% -25%, rgba(0, 255, 255, 0.7) 0%, transparent 45%)`,
        "radial-gradient(ellipse at 50% 50%, transparent, rgba(75, 0, 130, 0.8))",
        "linear-gradient(120deg, rgba(255, 0, 128, 0.3) 0%, transparent 50%, rgba(0, 255, 255, 0.3) 100%)",
        `radial-gradient(ellipse at ${this.position.x}% 0%, transparent -25%, rgba(255, 20, 147, 0.9) 150%)`,
      ];
      const forest = [
        `radial-gradient(ellipse at ${this.focusPercentPosX}% -25%, rgba(144, 238, 144, 0.5) 0%, transparent 50%)`,
        "radial-gradient(ellipse at 50% 50%, transparent, rgba(25, 25, 112, 0.7))",
        "linear-gradient(120deg, rgba(34, 139, 34, 0.4) 0%, transparent 50%, rgba(0, 100, 0, 0.4) 100%)",
        `radial-gradient(ellipse at ${this.position.x}% 0%, transparent -25%, rgba(50, 205, 50, 0.8) 150%)`,
      ];
      const underwater = [
        `radial-gradient(ellipse at ${this.focusPercentPosX}% -25%, rgba(64, 224, 208, 0.6) 0%, transparent 45%)`,
        "radial-gradient(ellipse at 50% 50%, transparent, rgba(0, 105, 148, 0.8))",
        "linear-gradient(120deg, rgba(0, 191, 255, 0.3) 0%, transparent 50%, rgba(30, 144, 255, 0.3) 100%)",
        `radial-gradient(ellipse at ${this.position.x}% 0%, transparent -25%, rgba(0, 206, 209, 0.9) 150%)`,
      ];
      const sunset = [
        `radial-gradient(ellipse at ${this.focusPercentPosX}% -25%, rgba(255, 140, 0, 0.8) 0%, transparent 40%)`,
        "radial-gradient(ellipse at 50% 50%, transparent, rgba(128, 0, 128, 0.6))",
        "linear-gradient(120deg, rgba(255, 69, 0, 0.4) 0%, transparent 50%, rgba(255, 215, 0, 0.4) 100%)",
        `radial-gradient(ellipse at ${this.position.x}% 0%, transparent -25%, rgba(255, 99, 71, 0.9) 150%)`,
      ];
      const arctic = [
        `radial-gradient(ellipse at ${this.focusPercentPosX}% -25%, rgba(173, 216, 230, 0.7) 0%, transparent 50%)`,
        "radial-gradient(ellipse at 50% 50%, transparent, rgba(25, 25, 112, 0.6))",
        "linear-gradient(120deg, rgba(176, 196, 222, 0.3) 0%, transparent 50%, rgba(70, 130, 180, 0.3) 100%)",
        `radial-gradient(ellipse at ${this.position.x}% 0%, transparent -25%, rgba(135, 206, 250, 0.8) 150%)`,
      ];
      const city = [
        `radial-gradient(ellipse at ${this.focusPercentPosX}% -25%, rgba(235, 180, 62, 0.75) 0%, transparent 50%)`,
        "radial-gradient(ellipse at 50% 50%, transparent, rgba(13, 12, 66, 0.75))",
        "linear-gradient(120deg, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)",
        `radial-gradient(ellipse at ${this.position.x}% 0%, transparent -25%, rgba(121, 98, 37, 1) 150%)`,
      ];
      const grads = city;
      return {
        background: grads.join(", "),
      };
    },
  },
  mounted() {
    // gsap.fromTo(
    //   this.position,
    //   { x: 100 },
    //   {
    //     x: 0,
    //     onUpdate: () => {
    //       this.position.x = Math.round(this.position.x);
    //     },
    //     duration: 5,
    //     repeat: -1,
    //     yoyo: true,
    //   }
    // );
  },
};
</script>

<style scoped>
#environment {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  pointer-events: none;
}
</style>
