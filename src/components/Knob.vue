<template>
  <div class="knob" @pointerdown="onPointerDown" @pointerup="onPointerUp">
    <div
      class="rotation-wrapper"
      :style="{ transform: `rotate(${rotationDeg}deg)` }"
    >
      <div class="indicator"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  emits: { "value-changed": (value: number) => true },
  props: {},
  components: {},
  data() {
    return {
      rotationDeg: 0 as number,
    };
  },
  methods: {
    onDrag(e: PointerEvent) {
      this.rotationDeg += e.movementX;
      this.$emit("value-changed", this.rotationDeg);
    },
    onPointerUp() {
      window.removeEventListener("pointermove", this.onDrag);
    },
    onPointerDown() {
      window.addEventListener("pointermove", this.onDrag);
      window.addEventListener("pointerup", this.onPointerUp);
    },
  },
  computed: {},
  watch: {},
  mounted() {},
};
</script>

<style scoped>
.knob {
  height: 1.5rem;
  width: 1.5rem;
  background-color: var(--neutral-bg);
  border-radius: 100%;
  position: relative;
  box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.25),
    inset -0.1rem 0.1rem 0 0.1rem rgba(255, 255, 255, 1),
    0 0.25rem 0 0.25rem #111, -0.1rem 0.5rem 0.25rem 0.3rem rgba(0, 0, 0, 0.25);
}

.rotation-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
  pointer-events: none;
  transform-origin: 50% 50%;
}

.indicator {
  pointer-events: none;
  position: absolute;
  top: 5%;
  height: 0.5rem;
  width: 0.2rem;
  left: calc(50% - 0.1rem);
  background-color: #333;
  border-radius: 1rem;
}
</style>
