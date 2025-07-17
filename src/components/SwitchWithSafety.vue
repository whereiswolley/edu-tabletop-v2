<template>
  <div class="switch-with-safety">
    <div class="switch-holder">
      <div class="switch-slot">
        <div
          :class="['switch', { 'is-flipped': isFlipped }]"
          @pointerdown="onFlip"
        ></div>
      </div>
    </div>
    <div
      :class="['safety', { 'is-armed': isArmed }]"
      @pointerdown="onArmed"
    ></div>
  </div>
</template>

<script lang="ts">
import { Howl } from "howler";
export default {
  emits: { "value-changed": (value: number) => true },
  props: {},
  components: {},
  data() {
    return {
      isFlipped: false,
      isArmed: false,
    };
  },
  methods: {
    onFlip() {
      this.$options.switch.play();
      this.isFlipped = !this.isFlipped;
    },
    onArmed() {
      this.$options.safety.play();
      this.isArmed = !this.isArmed;
      //
    },
  },
  computed: {},
  watch: {},
  mounted() {
    this.$options.safety = new Howl({
      src: ["https://cdn.pixabay.com/audio/2025/02/22/audio_a0898be8a1.mp3"],
    });
    this.$options.switch = new Howl({
      src: ["https://cdn.pixabay.com/audio/2024/12/04/audio_463641cc67.mp3"],
    });
  },
};
</script>

<style scoped>
.switch-with-safety {
  position: relative;
}

.safety {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  background: salmon;
  transform-origin: 50% 0%;
  transition: transform var(--base-transition),
    box-shadow var(--base-transition);
  box-shadow: var(--bs-upper-3d), var(--bs-bottom-3d),
    inset 0 -1rem 0 -0.95rem rgba(255, 255, 255, 0.5),
    inset 0 -1rem 0 0 rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.safety.is-armed {
  transform: rotateX(180deg);
  box-shadow: var(--bs-upper-3d), var(--bs-bottom-3d),
    inset 0 0 0 0 rgba(0, 0, 0, 0.5);
}

.switch-holder {
  height: 4rem;
  width: 2rem;
  background: radial-gradient(
    ellipse at 50% 75%,
    rgb(255, 255, 255) 0%,
    rgb(100, 100, 100) 125%
  );
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  box-shadow: var(--bs-upper-3d), var(--bs-bottom-3d);
}

.switch-slot {
  width: 100%;
  padding-top: 100%;
  background-color: var(--dark-bg);
  border-radius: 100%;
  position: relative;
}

.switch {
  position: absolute;
  top: calc(50% - 0.5rem);
  left: calc(50% - 0.5rem);
  height: 2rem;
  width: 1rem;
  border-radius: var(--border-radius);
  background-color: white;
  transform-origin: 50% 0%;
  box-shadow: var(--bs-upper-3d), var(--bs-bottom-3d);
}

.switch.is-flipped {
  transform: rotateX(180deg) translateY(-1rem);
}
</style>
